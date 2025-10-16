import { PrismaClient } from "@prisma/client";
import { OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting order seed...");

  const user1 = await prisma.user.findUnique({
    where: { userName: "121212" },
  });

  if (!user1) {
    throw new Error("User1 not found - make sure to run seedUsers.ts first");
  }

  const products = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "asc" },
  });

  if (products.length < 3) {
    throw new Error("Not enough products found - make sure to run seedProducts.ts first");
  }

  console.log(`Found ${products.length} products for user: ${user1.userName}`);

  const orders = [
    {
      userId: user1.id,
      totalCents: 275000,
      currency: "AUD",
      status: OrderStatus.PAID,
      stripeSessionId: "cs_test_paid_123456",
      stripePaymentId: "pi_test_paid_123456",
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPriceCents: products[0].priceCents,
          },
          {
            productId: products[1].id,
            quantity: 2,
            unitPriceCents: products[1].priceCents,
          },
        ],
      },
    },
    {
      userId: user1.id,
      totalCents: 95000,
      currency: "AUD",
      status: OrderStatus.PAID,
      stripeSessionId: "cs_test_paid_789012",
      stripePaymentId: "pi_test_paid_789012",
      orderItems: {
        create: [
          {
            productId: products[2].id,
            quantity: 1,
            unitPriceCents: products[2].priceCents,
          },
        ],
      },
    },
    {
      userId: user1.id,
      totalCents: 180000,
      currency: "AUD",
      status: OrderStatus.PENDING,
      stripeSessionId: "cs_test_pending_345678",
      orderItems: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            unitPriceCents: products[1].priceCents,
          },
          {
            productId: products[3].id,
            quantity: 1,
            unitPriceCents: products[3].priceCents,
          },
        ],
      },
    },
    {
      userId: user1.id,
      totalCents: 120000,
      currency: "AUD",
      status: OrderStatus.CANCELLED,
      stripeSessionId: "cs_test_cancelled_901234",
      orderItems: {
        create: [
          {
            productId: products[4].id,
            quantity: 1,
            unitPriceCents: products[4].priceCents,
          },
        ],
      },
    },
    {
      userId: user1.id,
      totalCents: 75000,
      currency: "AUD",
      status: OrderStatus.FAILED,
      stripeSessionId: "cs_test_failed_567890",
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPriceCents: products[0].priceCents,
          },
        ],
      },
    },
  ];

  for (const [index, orderData] of orders.entries()) {
    const orderNumber = `ORD-${user1.id.slice(-6)}-${String(index + 1).padStart(3, "0")}`;

    await prisma.order.upsert({
      where: {
        id: `seed-order-${user1.id}-${index + 1}`,
      },
      update: {},
      create: {
        id: `seed-order-${user1.id}-${index + 1}`,
        ...orderData,
      },
    });

    console.log(`✅ Created order ${orderNumber} with status: ${orderData.status}`);
  }

  const orderCount = await prisma.order.count({
    where: { userId: user1.id },
  });

  console.log(`✅ Created ${orderCount} orders for user: ${user1.userName}`);
  console.log("🌱 Order seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Order seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
