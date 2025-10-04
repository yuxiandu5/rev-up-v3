import { describe, it, expect } from "vitest";
import { testPrisma as prisma } from "../utils/test-prisma";

describe("Database Verification", () => {
  it("should be connected to the test database", async () => {
    // Query the current database name
    const result = await prisma.$queryRaw<[{ current_database: string }]>`SELECT current_database()`;
    const dbName = result[0].current_database;
    
    console.log("🔍 Currently connected to database:", dbName);
    expect(dbName).toBe("revup_test");
  });

  it("should be using port 5434", async () => {
    // Check if we can connect and the connection string is correct
    expect(process.env.DATABASE_URL).toContain("5434");
    expect(process.env.DATABASE_URL).toContain("revup_test");
  });

  it("should have a clean test database", async () => {
    // Count records in a few key tables - should be 0 or very low
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    
    console.log("👥 Users in test DB:", userCount);
    console.log("📦 Products in test DB:", productCount);
    
    // These should be 0 if we're using a clean test database
    // If these numbers are high, we're probably hitting your local DB
    expect(userCount).toBeLessThan(10); // Should be 0, but allowing some margin
    expect(productCount).toBeLessThan(10); // Should be 0, but allowing some margin
  });
});
