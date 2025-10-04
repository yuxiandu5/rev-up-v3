import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { testPrisma as prisma } from "../utils/test-prisma";
import { POST as registerPOST } from "../../src/app/api/auth/register/route";
import { POST as loginPOST } from "../../src/app/api/auth/login/route";
import { NextRequest } from "next/server";

describe("Authentication Integration Tests", () => {
  // Clean up test data after each test
  afterEach(async () => {
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});
  });

  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        userName: "testuser123",
        password: "SecurePass123!",
        recoverQuestion: "What is your favorite color?",
        answer: "blue",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await registerPOST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe("Account created successfully! You can now sign in.");

      // Verify user was created in database
      const dbUser = await prisma.user.findUnique({
        where: { userName: "testuser123" },
      });
      expect(dbUser).toBeTruthy();
      expect(dbUser?.userName).toBe("testuser123");
    });

    it("should reject duplicate usernames", async () => {
      // Create first user
      await prisma.user.create({
        data: {
          userName: "duplicate",
          passwordHash: "hashedpass",
          recoverQuestion: "test",
          answer: "test",
        },
      });

      const userData = {
        userName: "duplicate",
        password: "SecurePass123!",
        recoverQuestion: "What is your favorite color?",
        answer: "blue",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await registerPOST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("User with this username already exists");
    });

    it("should validate password requirements", async () => {
      const userData = {
        userName: "testuser",
        password: "weak", // Too weak
        recoverQuestion: "What is your favorite color?",
        answer: "blue",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await registerPOST(request);

      expect(response.status).toBe(400);
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = {
        userName: "logintest",
        password: "SecurePass123!",
        recoverQuestion: "What is your favorite color?",
        answer: "blue",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });

      await registerPOST(request);
    });

    it("should login with valid credentials", async () => {
      const loginData = {
        userName: "logintest",
        password: "SecurePass123!",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user.userName).toBe("logintest");
      expect(data.accessToken).toBeTruthy();

      // Verify refresh token was created
      const refreshTokens = await prisma.refreshToken.findMany({
        where: { user: { userName: "logintest" } },
      });
      expect(refreshTokens.length).toBe(1);
    });

    it("should reject invalid credentials", async () => {
      const loginData = {
        userName: "logintest",
        password: "WrongPassword123!",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid username or password");
    });

    it("should reject non-existent user", async () => {
      const loginData = {
        userName: "nonexistent",
        password: "SecurePass123!",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid username or password");
    });
  });

  describe("Database Relationships", () => {
    it("should handle user deletion with cascade", async () => {
      // Create user and refresh token
      const user = await prisma.user.create({
        data: {
          userName: "cascadetest",
          passwordHash: "hashedpass",
          recoverQuestion: "test",
          answer: "test",
        },
      });

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: "testhash",
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        },
      });

      // Delete user
      await prisma.user.delete({
        where: { id: user.id },
      });

      // Verify refresh tokens were also deleted (cascade)
      const remainingTokens = await prisma.refreshToken.findMany({
        where: { userId: user.id },
      });
      expect(remainingTokens.length).toBe(0);
    });
  });
});
