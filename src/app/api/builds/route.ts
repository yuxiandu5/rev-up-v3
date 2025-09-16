import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createBuildSchema } from "@/lib/validations";
import { verifyAccessJWT, extractBearerToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { mapToBuildSummaryDTOs, mapToBuildSummaryDTO, filterValidBuilds } from "@/lib/dto-mappers";
import type { ApiSuccessResponse } from "@/types/dtos";

/**
 * GET /api/builds - Get all builds for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get("authorization");
    const token = extractBearerToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const payload = await verifyAccessJWT(token);
    const userId = payload.sub;

    // Fetch user's builds
    const rawBuilds = await prisma.userBuild.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    // Filter out invalid builds and transform to DTOs
    const validBuilds = filterValidBuilds(rawBuilds);
    const buildDTOs = mapToBuildSummaryDTOs(validBuilds);

    const response: ApiSuccessResponse<typeof buildDTOs> = {
      data: buildDTOs,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Get builds error:", error);

    if (error instanceof Error && error.message.includes("Invalid or expired token")) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/builds - Create new build for authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get("authorization");
    const token = extractBearerToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const payload = await verifyAccessJWT(token);
    const userId = payload.sub;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createBuildSchema.parse(body);

    const newBuild = await prisma.userBuild.create({
      data: {
        userId: userId,
        selectedCar: validatedData.selectedCar,
        baseSpecs: validatedData.baseSpecs,
        selectedMods: validatedData.selectedMods,
        nickname: validatedData.nickname,
        notes: validatedData.notes,
      }
    });

    // Transform to DTO
    const buildDTO = mapToBuildSummaryDTO(newBuild);

    const response: ApiSuccessResponse<typeof buildDTO> = {
      data: buildDTO,
      message: "Build created successfully",
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("Create build error:", error);

    if (error instanceof Error && error.message.includes("Invalid or expired token")) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: error.issues 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
