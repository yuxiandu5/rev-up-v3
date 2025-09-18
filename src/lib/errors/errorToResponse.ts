import { NextResponse } from "next/server";
import { AppError } from "./AppError";

export function errorToResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}


