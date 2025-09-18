import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create sample users with hashed passwords
  const user1 = await prisma.user.upsert({
    where: {
      userName: "121212",
    },
    update: {role: Role.ADMIN},
    create: {
      userName: "121212",
      passwordHash: await hash("121212"),
      role: Role.ADMIN,
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
    update: {role: Role.MODERATOR},
    create: {
      userName: "131313",
      passwordHash: await hash("131313"),
      role: Role.MODERATOR,
      recoverQuestion: "131313",
      answer: "131313",
      isActive: true,
      lastLoginAt: null, // Never logged in
    },
  });

  const user3 = await prisma.user.upsert({
    where: {
      userName: "141414",
    },
    update: {},
    create: {
      userName: "141414",
      passwordHash: await hash("141414"),
      role: Role.USER,
      recoverQuestion: "141414",
      answer: "141414",
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
