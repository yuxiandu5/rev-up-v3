import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requestPasswordResetSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const { userName, answer } = requestPasswordResetSchema.parse(body);

    // Find user by userName
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (user && user.isActive) {
      const normalizedAnswer = answer.toLowerCase().trim();
      const answerHash = await hashPassword(normalizedAnswer);

      if (answerHash === user.answer) {
        return NextResponse.json({ message: "Password reset request successful" }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Invalid answer" }, { status: 400 });
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Password reset request error:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
