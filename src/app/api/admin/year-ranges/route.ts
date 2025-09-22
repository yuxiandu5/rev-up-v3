import { requireRole } from "@/lib/auth-guard";
import { NextRequest } from "next/server";
import { PaginationSchema, CarYearRangeCreateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { errorToResponse, ok, okPaginated } from "@/lib/apiResponse";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { searchParams } = new URL(req.url);

    const { page, pageSize } = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    const [yearRangeData, totalYearRangeCount] = await Promise.all([
      prisma.modelYearRange.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          badge: {
            select: {
              name: true,
              model: {
                select: {
                  name: true,
                  make: {
                    select: { name: true },
                  },
                },
              },
            },
          },
          startYear: true,
          endYear: true,
          chassis: true,
          hp: true,
          torque: true,
          zeroToHundred: true,
          handling: true,
          mediaAsset: {
            select: { url: true },
          },
        },
      }),
      prisma.modelYearRange.count(),
    ]);

    const formattedResults = yearRangeData.map((item) => ({
      ...item,
      make: item.badge.model.make.name,
      model: item.badge.model.name,
      badge: item.badge.name,
      mediaAsset: item.mediaAsset?.url,
    }));

    return okPaginated(
      formattedResults,
      page,
      pageSize,
      totalYearRangeCount,
      "Successfully fetched YearRange data!"
    );
  } catch (e) {
    console.log("Unexpected error in GET /year-ranges: ", e);
    return errorToResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const body = await req.json();
    const {
      badgeId,
      startYear,
      endYear,
      chassis,
      hp,
      torque,
      zeroToHundred,
      handling,
      imageUrl,
      imageDescription,
    } = CarYearRangeCreateSchema.parse(body);

    const result = await prisma.modelYearRange.create({
      data: {
        startYear,
        endYear,
        chassis,
        hp,
        torque,
        zeroToHundred,
        handling,
        mediaAsset: {
          create: {
            url: imageUrl,
            alt: imageDescription,
          },
        },
        badge: {
          connect: { id: badgeId },
        },
      },
    });

    return ok(result, "YearRange data created!", 201);
  } catch (e) {
    console.log("Unexpected error happened POST/year-ranges", e);
    return errorToResponse(e);
  }
}
