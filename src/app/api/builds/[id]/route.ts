import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateBuildSchema } from "@/lib/validations";
import { verifyAccessJWT, extractBearerToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { mapToBuildDetailDTO } from "@/lib/dto-mappers";
import type { ApiSuccessResponse } from "@/types/dtos";

/**
 * GET /api/builds/[id] - Get specific build (must be owned by user)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: buildId } = await params;

    // Find build with ownership check
    const build = await prisma.userBuild.findFirst({
      where: {
        id: buildId,
        userId: userId // Ensures user owns this build
      }
    });

    if (!build) {
      return NextResponse.json(
        { error: "Build not found or access denied" },
        { status: 404 }
      );
    }

    // Transform to detailed DTO
    const buildDTO = mapToBuildDetailDTO(build);

    const response: ApiSuccessResponse<typeof buildDTO> = {
      data: buildDTO,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Get build error:", error);

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
 * PUT /api/builds/[id] - Update specific build (must be owned by user)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: buildId } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateBuildSchema.parse(body);

    // Check if build exists and user owns it
    const existingBuild = await prisma.userBuild.findFirst({
      where: {
        id: buildId,
        userId: userId
      }
    });

    if (!existingBuild) {
      return NextResponse.json(
        { error: "Build not found or access denied" },
        { status: 404 }
      );
    }

    // Update build
    const updatedBuild = await prisma.userBuild.update({
      where: {
        id: buildId
      },
      data: {
        ...(validatedData.selectedCar && { selectedCar: validatedData.selectedCar }),
        ...(validatedData.baseSpecs && { baseSpecs: validatedData.baseSpecs }),
        ...(validatedData.selectedMods && { selectedMods: validatedData.selectedMods }),
        ...(validatedData.nickname !== undefined && { nickname: validatedData.nickname }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        updatedAt: new Date(),
      }
    });

    // Transform to detailed DTO
    const buildDTO = mapToBuildDetailDTO(updatedBuild);

    const response: ApiSuccessResponse<typeof buildDTO> = {
      data: buildDTO,
      message: "Build updated successfully",
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Update build error:", error);

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

/**
 * DELETE /api/builds/[id] - Delete specific build (must be owned by user)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: buildId } = await params;

    const existingBuild = await prisma.userBuild.findFirst({
      where: {
        id: buildId,
        userId: userId
      }
    });

    if (!existingBuild) {
      return NextResponse.json(
        { error: "Build not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.userBuild.delete({
      where: {
        id: buildId
      }
    });

    return NextResponse.json(
      { message: "Build deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete build error:", error);

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
