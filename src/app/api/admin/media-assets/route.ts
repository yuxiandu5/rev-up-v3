import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaAssetCreateSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { ConflictError } from "@/lib/errors/AppError";
import { toMediaAssetDTO } from "@/types/DTO/AdminDashboardDTO";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const mediaAssets = await prisma.mediaAsset.findMany({
      select: {
        id: true,
        name: true,
        url: true,
      },
    });

    const formattedResults = mediaAssets.map(toMediaAssetDTO);

    return ok(formattedResults, "Media assets fetched successfully", 200);
  } catch (error) {
    console.log("Unexpected error in GET /media-assets:", error);
    return errorToResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const body = await req.json();
    const { name, url, modId, modelYearRangeId } = MediaAssetCreateSchema.parse(body);

    const mediaAsset = await prisma.mediaAsset.create({
      data: { name, url, modId: modId ?? null, modelYearRangeId: modelYearRangeId ?? null },
    });

    return ok(mediaAsset, "Media asset created successfully", 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return errorToResponse(
          new ConflictError("Media asset with this modId or modelYearRangeId already exists")
        );
      }
    }
    console.log("Unexpected error in POST /media-assets:", error);
    return errorToResponse(error);
  }
}
