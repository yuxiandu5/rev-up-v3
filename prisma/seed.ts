import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample users with hashed passwords
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      passwordHash: await argon2.hash('password123', {
        type: argon2.argon2id,
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 1,
      }),
      emailVerifiedAt: new Date(),
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      passwordHash: await argon2.hash('securepass456', {
        type: argon2.argon2id,
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 1,
      }),
      emailVerifiedAt: null, // Not verified yet
      isActive: true,
      lastLoginAt: null, // Never logged in
    },
  });

  console.log('✅ Created users:');
  console.log(`📧 User 1: ${user1.email} (ID: ${user1.id}) - Email verified`);
  console.log(`📧 User 2: ${user2.email} (ID: ${user2.id}) - Email not verified`);
  
  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
