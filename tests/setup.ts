import { beforeAll, afterAll, vi } from "vitest";

// Set test environment variables BEFORE any imports
Object.assign(process.env, {
  NODE_ENV: "test",
  JWT_SECRET: "test-jwt-secret",
  DATABASE_URL: process.env.CI
  ? "postgresql://postgres:postgres@localhost:5432/revup_test"
  : "postgresql://postgres:postgres@localhost:5434/revup_test",
});

beforeAll(async () => {
  console.log("🧪 Setting up test environment...");
  console.log("📊 Using test database:", process.env.DATABASE_URL);
});

afterAll(async () => {
  console.log("🧹 Cleaning up test environment...");

  vi.clearAllMocks();
});
