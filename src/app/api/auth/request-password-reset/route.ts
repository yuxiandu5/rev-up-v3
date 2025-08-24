import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requestPasswordResetSchema } from "@/lib/validations";
import { generateToken, hashToken } from "@/lib/crypto";
import { sendEmail, generatePasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { TokenType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const { email } = requestPasswordResetSchema.parse(body);
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    // Always return success to prevent email enumeration
    // but only send email if user exists
    if (user && user.isActive) {
      // Generate password reset token
      const resetToken = generateToken();
      const tokenHash = hashToken(resetToken);

      // Get client info
      const userAgent = request.headers.get("user-agent") || null;
      const ipAddress = request.headers.get("x-forwarded-for") || 
                        request.headers.get("x-real-ip") || 
                        "unknown";

      // Revoke any existing password reset tokens for this user
      // and create new one in a transaction
      await prisma.$transaction([
        // Mark any existing PASSWORD_RESET tokens as consumed
        prisma.oneTimeToken.updateMany({
          where: {
            userId: user.id,
            type: TokenType.PASSWORD_RESET,
            consumedAt: null,
          },
          data: { consumedAt: new Date() }
        }),
        // Create new password reset token
        prisma.oneTimeToken.create({
          data: {
            userId: user.id,
            type: TokenType.PASSWORD_RESET,
            tokenHash,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            userAgent,
            ipAddress,
          }
        })
      ]);

      // Send password reset email
      const emailOptions = generatePasswordResetEmail(normalizedEmail, resetToken);
      await sendEmail(emailOptions);
    }

    // Always return success (204) to prevent email enumeration
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Password reset request error:", error);

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
