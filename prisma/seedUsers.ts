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
    update: { role: Role.ADMIN },
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
    update: { role: Role.MODERATOR },
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

  // Generate 20 more users following the pattern
  const users = [];
  for (let i = 15; i <= 34; i++) {
    const pattern = i.toString().repeat(6);
    const roles = [Role.USER, Role.MODERATOR, Role.ADMIN];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const isActive = Math.random() > 0.2; // 80% chance of being active
    const hasLoggedIn = Math.random() > 0.3; // 70% chance of having logged in

    const user = await prisma.user.upsert({
      where: {
        userName: pattern,
      },
      update: {},
      create: {
        userName: pattern,
        passwordHash: await hash(pattern),
        role: randomRole,
        recoverQuestion: pattern,
        answer: pattern,
        isActive: isActive,
        lastLoginAt: hasLoggedIn
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          : null, // Random date within last 30 days or null
      },
    });

    users.push(user);
  }

  console.log(`🌱 Users seed completed! Created ${3 + users.length} users total.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
