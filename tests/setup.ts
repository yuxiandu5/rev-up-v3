import { beforeAll, afterAll, beforeEach } from "vitest";

// This file runs before each test file

beforeAll(async () => {
  // Global setup - runs once before all tests
  console.log("🧪 Setting up test environment...");

  // Set test environment variables
  process.env.NODE_ENV = "test";

  // We'll add database setup here later
});

beforeEach(async () => {
  // Runs before each individual test
  // We'll add database cleanup here later
});

afterAll(async () => {
  // Global cleanup - runs once after all tests
  console.log("🧹 Cleaning up test environment...");

  // We'll add database cleanup here later
});
