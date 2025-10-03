import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { IdSchema, MediaAssetUpdateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors/AppError";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const existing = await prisma.mediaAsset.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError("Media asset not found");

    const body = await req.json();
    const { name, url, modId, modelYearRangeId } = MediaAssetUpdateSchema.parse(body);

    const updatedMediaAsset = await prisma.mediaAsset.update({
      where: { id },
      data: { name, url, modId: modId ?? null, modelYearRangeId: modelYearRangeId ?? null },
    });

    return ok(updatedMediaAsset, "Media asset updated!", 200);
  } catch (error) {
    console.log("Unexpected error in PATCH /media-assets/[id]:", error);
    return errorToResponse(error);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    await prisma.mediaAsset.delete({
      where: { id },
    });

    return ok(null, "Media asset deleted!", 200);
  } catch (error) {
    console.log("Unexpected error in DELETE /media-assets/[id]:", error);
    return errorToResponse(error);
  }
}
