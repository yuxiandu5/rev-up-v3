import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create sample users with hashed passwords
  const user1 = await prisma.user.upsert({
    where: {
      userName: "121212",
    },
    update: {},
    create: {
      userName: "121212",
      passwordHash: await hash("121212"),
      recoverQuestion: "121212",
      answer: "121212",
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: {
      userName: "131313",
    },
    update: {},
    create: {
      userName: "131313",
      passwordHash: await hash("131313"),
      recoverQuestion: "131313",
      answer: "131313",
      isActive: true,
      lastLoginAt: null, // Never logged in
    },
  });

  console.log("🌱 Users seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
