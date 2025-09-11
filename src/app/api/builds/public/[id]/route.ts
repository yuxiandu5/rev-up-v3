import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/builds/public/[id] - Get build for public viewing (no auth required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: buildId } = await params;

    // Find build by ID (no ownership check for public viewing)
    const build = await prisma.userBuild.findUnique({
      where: {
        id: buildId
      },
      select: {
        id: true,
        nickname: true,
        notes: true,
        selectedCar: true,
        baseSpecs: true,
        selectedMods: true,
        createdAt: true,
        updatedAt: true,
        // Include user info for attribution (but not sensitive data)
        user: {
          select: {
            userName: true
          }
        }
      }
    });

    if (!build) {
      return NextResponse.json(
        { error: "Build not found" },
        { status: 404 }
      );
    }

    // Return build data for public viewing
    return NextResponse.json({
      id: build.id,
      nickname: build.nickname,
      notes: build.notes,
      selectedCar: build.selectedCar,
      baseSpecs: build.baseSpecs,
      selectedMods: build.selectedMods,
      createdAt: build.createdAt,
      updatedAt: build.updatedAt,
      createdBy: build.user.userName, // Attribution
    }, { status: 200 });

  } catch (error) {
    console.error("Get public build error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
