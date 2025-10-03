import { beforeAll, afterAll, vi } from "vitest";

beforeAll(async () => {
  console.log("🧪 Setting up test environment...");

  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.DATABASE_URL = "test-database-url";
});

afterAll(async () => {
  console.log("🧹 Cleaning up test environment...");

  vi.clearAllMocks();
});