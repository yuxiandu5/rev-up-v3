import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { hashPassword } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 403 });
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { userName },
        data: { passwordHash: newPasswordHash },
      }),
      // Revoke all refresh tokens for this user
      prisma.refreshToken.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      }),
    ]);

    // Return success (204 No Content)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Password reset error:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
