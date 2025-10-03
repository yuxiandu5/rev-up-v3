import { beforeAll, afterAll, vi } from "vitest";

beforeAll(async () => {
  console.log("🧪 Setting up test environment...");

  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5434/revup_test";
});

afterAll(async () => {
  console.log("🧹 Cleaning up test environment...");

  vi.clearAllMocks();
});