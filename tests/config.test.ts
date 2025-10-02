import { describe, it, expect } from "vitest";

describe("Test Configuration", () => {
  it("should run a basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have access to environment variables", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });

  it("should resolve path aliases", async () => {
    // This tests if our @ alias works
    const { prisma } = await import("@/lib/prisma");
    expect(prisma).toBeDefined();
  });
});
