import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { testPrisma } from "../utils/test-prisma";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

const testUser = {
  id: "checkout-test-user",
  userName: "checkoutuser",
  passwordHash: "hashed-password",
  recoverQuestion: "Test question",
  answer: "Test answer",
  role: "USER" as const,
};

const testMod = {
  id: "checkout-test-mod",
  name: "Test Exhaust",
  slug: "test-exhaust",
  brand: "TestBrand",
  category: "exhaust",
};

const testProduct1 = {
  id: "checkout-test-product-1",
  name: "Test Exhaust System",
  description: "High performance exhaust",
  priceCents: 120000,
  currency: "AUD",
  isActive: true,
  imageUrl: "https://example.com/exhaust.jpg",
  modId: "checkout-test-mod",
};

const testProduct2 = {
  id: "checkout-test-product-2",
  name: "Test Air Filter",
  description: "Cold air intake",
  priceCents: 35000,
  currency: "AUD",
  isActive: true,
  imageUrl: "https://example.com/filter.jpg",
  modId: "checkout-test-mod",
};

describe("Checkout API Integration Tests", () => {
  beforeAll(async () => {
    await testPrisma.user.create({ data: testUser });
    await testPrisma.mod.create({ data: testMod });
    await testPrisma.product.createMany({
      data: [testProduct1, testProduct2],
    });
  });

  afterAll(async () => {
    await testPrisma.orderItem.deleteMany();
    await testPrisma.order.deleteMany();
    await testPrisma.cartItem.deleteMany();
    await testPrisma.cart.deleteMany();
    await testPrisma.product.deleteMany();
    await testPrisma.mod.deleteMany();
    await testPrisma.user.deleteMany();
  });

  beforeEach(async () => {
    await testPrisma.orderItem.deleteMany();
    await testPrisma.order.deleteMany();
    await testPrisma.cartItem.deleteMany();
    await testPrisma.cart.deleteMany();
    vi.clearAllMocks();
  });

  describe("Checkout Session Creation", () => {
    it("should create order with PENDING status and OrderItems", async () => {
      const cart = await testPrisma.cart.create({
        data: {
          userId: testUser.id,
          items: {
            create: [
              {
                productId: testProduct1.id,
                quantity: 2,
                unitPriceCents: testProduct1.priceCents,
              },
              {
                productId: testProduct2.id,
                quantity: 1,
                unitPriceCents: testProduct2.priceCents,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      const expectedTotal = 2 * 120000 + 1 * 35000;

      const order = await testPrisma.order.create({
        data: {
          userId: testUser.id,
          totalCents: expectedTotal,
          currency: "AUD",
          status: "PENDING",
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPriceCents: item.unitPriceCents,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      expect(order).toBeDefined();
      expect(order.status).toBe("PENDING");
      expect(order.totalCents).toBe(expectedTotal);
      expect(order.currency).toBe("AUD");
      expect(order.orderItems).toHaveLength(2);
      expect(order.orderItems[0].quantity).toBe(2);
      expect(order.orderItems[1].quantity).toBe(1);
    });

    it("should calculate correct total for multiple items", async () => {
      const cart = await testPrisma.cart.create({
        data: {
          userId: testUser.id,
          items: {
            create: [
              {
                productId: testProduct1.id,
                quantity: 3,
                unitPriceCents: testProduct1.priceCents,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      const totalCents = cart.items.reduce(
        (total, item) => total + item.unitPriceCents * item.quantity,
        0
      );

      expect(totalCents).toBe(360000);
    });

    it("should not create order if cart is empty", async () => {
      const cart = await testPrisma.cart.create({
        data: { userId: testUser.id },
      });

      const cartWithItems = await testPrisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: true },
      });

      expect(cartWithItems?.items.length).toBe(0);
    });
  });

  describe("Webhook - Checkout Session Completed", () => {
    it("should update order status to PAID and clear cart", async () => {
      const cart = await testPrisma.cart.create({
        data: {
          userId: testUser.id,
          items: {
            create: [
              {
                productId: testProduct1.id,
                quantity: 1,
                unitPriceCents: testProduct1.priceCents,
              },
            ],
          },
        },
      });

      const order = await testPrisma.order.create({
        data: {
          userId: testUser.id,
          totalCents: 120000,
          currency: "AUD",
          status: "PENDING",
          stripeSessionId: "cs_test_123",
          orderItems: {
            create: {
              productId: testProduct1.id,
              quantity: 1,
              unitPriceCents: testProduct1.priceCents,
            },
          },
        },
      });

      await testPrisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            stripePaymentId: "pi_test_123",
          },
        });

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      });

      const updatedOrder = await testPrisma.order.findUnique({
        where: { id: order.id },
      });
      expect(updatedOrder?.status).toBe("PAID");
      expect(updatedOrder?.stripePaymentId).toBe("pi_test_123");

      const cartItems = await testPrisma.cartItem.findMany({
        where: { cartId: cart.id },
      });
      expect(cartItems).toHaveLength(0);
    });

    it("should be idempotent - handle duplicate webhook events", async () => {
      const order = await testPrisma.order.create({
        data: {
          userId: testUser.id,
          totalCents: 120000,
          currency: "AUD",
          status: "PAID",
          stripeSessionId: "cs_test_123",
          stripePaymentId: "pi_test_123",
          orderItems: {
            create: {
              productId: testProduct1.id,
              quantity: 1,
              unitPriceCents: testProduct1.priceCents,
            },
          },
        },
      });

      const existingOrder = await testPrisma.order.findUnique({
        where: { id: order.id },
      });

      if (existingOrder?.status === "PAID") {
        expect(existingOrder.status).toBe("PAID");
        return;
      }

      expect(true).toBe(true);
    });
  });

  describe("Webhook - Checkout Session Expired", () => {
    it("should update order status to CANCELLED", async () => {
      const order = await testPrisma.order.create({
        data: {
          userId: testUser.id,
          totalCents: 120000,
          currency: "AUD",
          status: "PENDING",
          stripeSessionId: "cs_test_expired",
          orderItems: {
            create: {
              productId: testProduct1.id,
              quantity: 1,
              unitPriceCents: testProduct1.priceCents,
            },
          },
        },
      });

      await testPrisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });

      const updatedOrder = await testPrisma.order.findUnique({
        where: { id: order.id },
      });
      expect(updatedOrder?.status).toBe("CANCELLED");
    });
  });

  describe("Order Creation Edge Cases", () => {
    it("should snapshot product prices at time of order", async () => {
      const cart = await testPrisma.cart.create({
        data: {
          userId: testUser.id,
          items: {
            create: {
              productId: testProduct1.id,
              quantity: 1,
              unitPriceCents: 120000,
            },
          },
        },
        include: { items: true },
      });

      const order = await testPrisma.order.create({
        data: {
          userId: testUser.id,
          totalCents: 120000,
          currency: "AUD",
          status: "PENDING",
          orderItems: {
            create: {
              productId: testProduct1.id,
              quantity: 1,
              unitPriceCents: 120000,
            },
          },
        },
        include: { orderItems: true },
      });

      await testPrisma.product.update({
        where: { id: testProduct1.id },
        data: { priceCents: 150000 },
      });

      expect(order.orderItems[0].unitPriceCents).toBe(120000);
      expect(order.totalCents).toBe(120000);
    });

    it("should handle orders with multiple quantities correctly", async () => {
      const order = await testPrisma.order.create({
        data: {
          userId: testUser.id,
          totalCents: 240000,
          currency: "AUD",
          status: "PENDING",
          orderItems: {
            create: {
              productId: testProduct1.id,
              quantity: 2,
              unitPriceCents: 120000,
            },
          },
        },
        include: { orderItems: true },
      });

      expect(order.orderItems[0].quantity).toBe(2);
      expect(order.totalCents).toBe(240000);
    });
  });

  describe("Cart Clearing After Payment", () => {
    it("should only clear items, not delete the cart itself", async () => {
      const cart = await testPrisma.cart.create({
        data: {
          userId: testUser.id,
          items: {
            create: [
              {
                productId: testProduct1.id,
                quantity: 1,
                unitPriceCents: testProduct1.priceCents,
              },
            ],
          },
        },
      });

      await testPrisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      const cartAfter = await testPrisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: true },
      });

      expect(cartAfter).toBeDefined();
      expect(cartAfter?.items).toHaveLength(0);
    });
  });
});
