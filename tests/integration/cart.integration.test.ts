import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { testPrisma } from "../utils/test-prisma";

// Test data
const testUser = {
  id: "test-user-123",
  userName: "testuser",
  passwordHash: "hashed-password",
  recoverQuestion: "Test question",
  answer: "Test answer",
  role: "USER" as const,
};

const testProduct = {
  id: "test-product-123",
  name: "Test Turbo",
  description: "Test turbo description",
  priceCents: 50000, // $500
  currency: "AUD",
  isActive: true,
  imageUrl: "https://example.com/turbo.jpg",
  modId: "test-mod-123",
};

const testMod = {
  id: "test-mod-123",
  name: "Test Mod",
  slug: "test-mod",
  brand: "TestBrand",
  category: "turbo",
};

describe("Cart API Integration Tests", () => {
  beforeAll(async () => {
    // Setup test data
    await testPrisma.user.create({ data: testUser });
    await testPrisma.mod.create({ data: testMod });
    await testPrisma.product.create({ data: testProduct });
  });

  afterAll(async () => {
    // Cleanup
    await testPrisma.cartItem.deleteMany();
    await testPrisma.cart.deleteMany();
    await testPrisma.product.deleteMany();
    await testPrisma.mod.deleteMany();
    await testPrisma.user.deleteMany();
  });

  beforeEach(async () => {
    // Clear cart before each test
    await testPrisma.cartItem.deleteMany();
    await testPrisma.cart.deleteMany();
  });

  describe("POST /api/cart/items", () => {
    it("should add new item to cart", async () => {
      // This would require setting up auth token
      // For now, we'll test the database operations directly

      // Create cart
      const cart = await testPrisma.cart.create({
        data: { userId: testUser.id },
      });

      // Add item
      const cartItem = await testPrisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: testProduct.id,
          quantity: 2,
          unitPriceCents: testProduct.priceCents,
        },
      });

      expect(cartItem).toBeDefined();
      expect(cartItem.quantity).toBe(2);
      expect(cartItem.unitPriceCents).toBe(50000);
    });

    it("should increment quantity for existing product", async () => {
      // Create cart and initial item
      const cart = await testPrisma.cart.create({
        data: { userId: testUser.id },
      });

      await testPrisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: testProduct.id,
          quantity: 2,
          unitPriceCents: testProduct.priceCents,
        },
      });

      // Simulate adding same product again
      const updatedItem = await testPrisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: testProduct.id,
          },
        },
        update: {
          quantity: { increment: 1 },
        },
        create: {
          cartId: cart.id,
          productId: testProduct.id,
          quantity: 1,
          unitPriceCents: testProduct.priceCents,
        },
      });

      expect(updatedItem.quantity).toBe(3);
    });
  });

  describe("Cart Sync Logic", () => {
    it("should merge guest cart with existing DB cart", async () => {
      // Create existing cart with one item
      const cart = await testPrisma.cart.create({
        data: { userId: testUser.id },
      });

      await testPrisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: testProduct.id,
          quantity: 2,
          unitPriceCents: testProduct.priceCents,
        },
      });

      // Simulate guest cart sync
      const guestCartItems = [
        { productId: testProduct.id, quantity: 3 }, // Same product
      ];

      // Simulate the sync logic
      for (const guestItem of guestCartItems) {
        await testPrisma.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: guestItem.productId,
            },
          },
          update: {
            quantity: { increment: guestItem.quantity },
          },
          create: {
            cartId: cart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            unitPriceCents: testProduct.priceCents,
          },
        });
      }

      // Verify merged quantity
      const finalItem = await testPrisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: testProduct.id,
          },
        },
      });

      expect(finalItem?.quantity).toBe(5); // 2 + 3
    });
  });

  describe("Cart Calculations", () => {
    it("should calculate subtotal correctly", async () => {
      const cart = await testPrisma.cart.create({
        data: { userId: testUser.id },
      });

      // Add items with different quantities
      await testPrisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: testProduct.id,
          quantity: 2,
          unitPriceCents: 50000, // $500
        },
      });

      // Fetch cart with items
      const cartWithItems = await testPrisma.cart.findUnique({
        where: { userId: testUser.id },
        include: { items: true },
      });

      // Calculate subtotal
      const subtotal =
        cartWithItems?.items.reduce((sum, item) => {
          return sum + item.unitPriceCents * item.quantity;
        }, 0) || 0;

      expect(subtotal).toBe(100000); // 2 * $500 = $1000
    });
  });
});
