import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapToBuildDetailDTO } from "@/lib/dto-mappers";
import type { ApiSuccessResponse } from "@/types/dtos";

/**
 * GET /api/builds/public/[id] - Get build for public viewing (no auth required)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: buildId } = await params;

    // Find build by ID (no ownership check for public viewing)
    const build = await prisma.userBuild.findUnique({
      where: {
        id: buildId,
      },
      include: {
        user: {
          select: {
            userName: true,
          },
        },
      },
    });

    if (!build) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    // Transform to detailed DTO with user attribution
    const buildDTO = mapToBuildDetailDTO(build);

    const response: ApiSuccessResponse<typeof buildDTO> = {
      data: buildDTO,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get public build error:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
