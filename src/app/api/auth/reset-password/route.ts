import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { resetPasswordSchema } from "@/lib/validations";
import { hashPassword, hashToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { TokenType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const { token, newPassword } = resetPasswordSchema.parse(body);

    // Hash the token to find it in database
    const tokenHash = hashToken(token);

    // Find the password reset token
    const oneTimeToken = await prisma.oneTimeToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    // Validate token exists and is for password reset
    if (!oneTimeToken || oneTimeToken.type !== TokenType.PASSWORD_RESET) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token is already consumed
    if (oneTimeToken.consumedAt) {
      return NextResponse.json(
        { error: "Reset token has already been used" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (oneTimeToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Check if user is active
    if (!oneTimeToken.user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Hash the new password
    const newPasswordHash = await hashPassword(newPassword);

    // Perform all operations in a transaction:
    // 1. Update user password
    // 2. Mark token as consumed
    // 3. Revoke all refresh tokens for the user
    await prisma.$transaction([
      // Update user password
      prisma.user.update({
        where: { id: oneTimeToken.userId },
        data: { passwordHash: newPasswordHash }
      }),
      // Mark token as consumed
      prisma.oneTimeToken.update({
        where: { id: oneTimeToken.id },
        data: { consumedAt: new Date() }
      }),
      // Revoke all refresh tokens for this user
      prisma.refreshToken.updateMany({
        where: {
          userId: oneTimeToken.userId,
          revokedAt: null
        },
        data: { revokedAt: new Date() }
      })
    ]);

    // Return success (204 No Content)
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Password reset error:", error);

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
