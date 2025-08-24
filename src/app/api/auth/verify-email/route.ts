import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { hashToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { TokenType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Parse and validate input from request body
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Hash the plaintext token
    const tokenHash = hashToken(token);

    // Find the token in database
    const oneTimeToken = await prisma.oneTimeToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    // Validate token exists and is for email verification
    if (!oneTimeToken || oneTimeToken.type !== TokenType.EMAIL_VERIFY) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if token is already consumed
    if (oneTimeToken.consumedAt) {
      return NextResponse.json(
        { error: "Verification token has already been used" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (oneTimeToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Check if email is already verified
    if (oneTimeToken.user.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Perform verification in a transaction
    await prisma.$transaction([
      // Mark token as consumed
      prisma.oneTimeToken.update({
        where: { id: oneTimeToken.id },
        data: { consumedAt: new Date() }
      }),
      // Set emailVerifiedAt on user
      prisma.user.update({
        where: { id: oneTimeToken.userId },
        data: { emailVerifiedAt: new Date() }
      })
    ]);

    // Return success (204 No Content)
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Email verification error:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
