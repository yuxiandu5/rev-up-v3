import { CarYearRangeUpdateSchema, YearRangeIdFormatSchema } from "@/lib/validations";
import { requireRole } from "@/lib/auth-guard";
import { NextRequest } from "next/server";
import { ifYearRangeExist } from "../year-ranges-helpers";
import { prisma } from "@/lib/prisma";
import { errorToResponse, ok } from "@/lib/apiResponse";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = YearRangeIdFormatSchema.parse(await params);
    await ifYearRangeExist(id);

    const body = await req.json();
    const {
      startYear,
      endYear,
      chassis,
      hp,
      torque,
      zeroToHundred,
      handling,
      imageUrl,
      imageDescription,
    } = CarYearRangeUpdateSchema.parse(body);

    const result = await prisma.modelYearRange.update({
      where: { id },
      data: {
        startYear,
        endYear,
        chassis,
        hp,
        torque,
        zeroToHundred,
        handling,
        mediaAsset: imageUrl
          ? {
              upsert: {
                create: { url: imageUrl, alt: imageDescription },
                update: { url: imageUrl, alt: imageDescription },
              },
            }
          : undefined,
      },
      include: {
        mediaAsset: {
          select: {
            url: true,
            alt: true,
          },
        },
      },
    });

    return ok(result, "YearRange data updated!", 200);
  } catch (e) {
    console.log("Unexpected Error PATCH/year-ranges/[id]", e);
    return errorToResponse(e);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = YearRangeIdFormatSchema.parse(params);
    await ifYearRangeExist(id);

    const res = await prisma.modelYearRange.delete({
      where: { id },
    });

    return ok(res, "YearRange data deleted!", 200);
  } catch (e) {
    console.log("Unexpected error DELETE/year-ranges[id]", e);
    return errorToResponse(e);
  }
}
