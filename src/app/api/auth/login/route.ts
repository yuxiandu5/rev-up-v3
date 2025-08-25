import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { loginSchema } from "@/lib/validations";
import { verifyPassword, generateToken, hashToken, addDays } from "@/lib/crypto";
import { issueAccessJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS || "14");

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.passwordHash, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Generate refresh token
    const refreshToken = generateToken();
    const tokenHash = hashToken(refreshToken);

    // Get client info
    const userAgent = request.headers.get("user-agent") || null;
    const ipAddress = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown";

    // Create refresh token and update last login in transaction
    await prisma.$transaction([
      // Create refresh token
      prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash,
          userAgent,
          ipAddress,
          expiresAt: addDays(new Date(), REFRESH_TTL_DAYS),
        }
      }),
      // Update last login
      prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })
    ]);

    // Issue access JWT
    const accessToken = await issueAccessJWT({
      sub: user.id,
      email: user.email,
    });

    // Set refresh token cookie
    const response = NextResponse.json(
      { accessToken, user: { id: user.id, email: user.email } },
      { status: 200 }
    );
    
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60, // Convert days to seconds
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
