import { PrismaClient } from "@prisma/client";

// Ensure we're using the test database URL
const testDatabaseUrl =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5434/revup_test";

if (process.env.NODE_ENV !== "test") {
  throw new Error("Test Prisma client should only be used in test environment!");
}

// Force the test database URL
process.env.DATABASE_URL = testDatabaseUrl;

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl,
    },
  },
});

// Verify we're connected to the test database
testPrisma
  .$connect()
  .then(async () => {
    const result = await testPrisma.$queryRaw`SELECT current_database() as db_name`;
    console.log("🔗 Connected to test database:", result);
  })
  .catch(console.error);
