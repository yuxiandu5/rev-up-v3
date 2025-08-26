import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { registerSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input 
    const body = await request.json();
    const { userName, password, recoverQuestion, answer } = registerSchema.parse(body);

    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { userName }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 409 }
      );
    }

    // Hash password with Argon2id
    const passwordHash = await hashPassword(password);
    const normalizedAnswer = answer.toLowerCase().trim();
    const answerHash = await hashPassword(normalizedAnswer);

    // Create user
    await prisma.user.create({
      data: {
        userName,
        recoverQuestion,
        answer: answerHash,
        passwordHash,
        isActive: true,
      }
    });

    return NextResponse.json({ 
      message: "Account created successfully! You can now sign in." 
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    if (error instanceof Error && 
        (error.message.includes("Unique constraint") || 
          error.message.includes("User with this username already exists"))) {
      return NextResponse.json(
        { error: "User with this user name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
