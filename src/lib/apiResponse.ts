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
    // Format Zod validation errors into user-friendly messages
    const formatZodError = (zodError: ZodError): string => {
      const issues = zodError.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'field';
        return `${path}: ${issue.message}`;
      });
      
      if (issues.length === 1) {
        return `Validation error: ${issues[0]}`;
      }
      
      return `Validation errors: ${issues.join(', ')}`;
    };

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: formatZodError(error),
        error: {
          code: "VALIDATION_ERROR",
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
