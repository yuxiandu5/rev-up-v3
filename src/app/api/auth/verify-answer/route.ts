import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAnswerSchema } from "@/lib/validations";
import { verifyPassword } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, answer } = verifyAnswerSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { userName }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAnswerCorrect = await verifyPassword(user.answer, answer);
    if (!isAnswerCorrect) {
      return NextResponse.json({ error: "Invalid answer" }, { status: 400 });
    }

    return NextResponse.json({ message: "Answer verified" }, { status: 200 });
  }

  catch (error) {
    console.error("Verify answer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}