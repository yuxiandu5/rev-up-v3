import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create sample users with hashed passwords
  const user1 = await prisma.user.upsert({
    where: {
      userName: "john.doe",
    },
    update: {},
    create: {
      userName: "john.doe",
      passwordHash: await hash("password123"),
      recoverQuestion: "What is your mother's maiden name?",
      answer: "Smith",
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: {
      userName: "jane.smith",
    },
    update: {},
    create: {
      userName: "jane.smith",
      passwordHash: await hash("securepass456"),
      recoverQuestion: "What is your mother's maiden name?",
      answer: "Smith",
      isActive: true,
      lastLoginAt: null, // Never logged in
    },
  });

  console.log("✅ Created users:");
  console.log(`📧 User 1: ${user1.userName} (ID: ${user1.id})`);
  console.log(`📧 User 2: ${user2.userName} (ID: ${user2.id})`);
  
  console.log("🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
