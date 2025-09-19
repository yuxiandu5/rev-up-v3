import { NextResponse } from "next/server";
import { AppError } from "./errors/AppError";
import { ZodError } from "zod";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string | undefined;
  };
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

// ✅ Success response
export function ok<T>(data: T, message = "OK", status = 200) {
  const body: ApiResponse<T> = { success: true, message, data };
  return NextResponse.json(body, { status });
}

// ✅ Success response with pagination
export function okPaginated<T>(
  data: T,
  page: number,
  pageSize: number,
  total: number,
  message = "OK",
  status = 200
) {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
  return NextResponse.json(body, { status });
}

// ❌ Error response
export function fail(code: string, message: string, status = 400) {
  const body: ApiResponse<null> = {
    success: false,
    message,
    error: { code },
  };
  return NextResponse.json(body, { status });
}

// ❌ Convert thrown error → response
export function errorToResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: error.message,
        error: { code: error.code },
      },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      message: "Validation failed",
      error: {
        code: "BAD_REQUEST",
      },
    },
      { status: 400 }
    );
  }

  // Fallback
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    },
    { status: 500 }
  );
}
