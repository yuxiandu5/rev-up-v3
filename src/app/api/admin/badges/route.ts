import { errorToResponse, okPaginated, ok } from "@/lib/apiResponse";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { BadgeCreateSchema, PaginationSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { toSlug } from "@/lib/utils";
import { NotFoundError } from "@/lib/errors/AppError";
import { BadgeResponseDTO, toBadgeDTO } from "@/types/DTO/AdminDashboardDTO";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { searchParams } = new URL(req.url);

    const { page, pageSize } = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    const [badgeData, totalBadgeCount] = await Promise.all([
      prisma.badge.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          slug: true,
          model: {
            select: {
              name: true,
              make: {
                select: {
                  name: true,
                },
              },
            },
          },
          yearRanges: {
            select: {
              startYear: true,
              endYear: true,
            },
          },
        },
      }),
      prisma.badge.count(),
    ]);

    const badgeDataFormatted: BadgeResponseDTO[] = badgeData.map(toBadgeDTO);

    return okPaginated(
      badgeDataFormatted,
      page,
      pageSize,
      totalBadgeCount,
      "Successfully fetched badge data!"
    );
  } catch (e) {
    console.log("Error GET/badges", e);
    return errorToResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const body = await req.json();
    const { modelId, name, slug } = BadgeCreateSchema.parse(body);

    const existing = await prisma.model.findUnique({
      where: { id: modelId },
    });
    if (!existing) throw new NotFoundError("Model ID does not exist!");

    const res = await prisma.badge.create({
      data: {
        modelId,
        name,
        slug: slug ?? toSlug(name),
      },
    });

    return ok(res, "badge Created!", 201);
  } catch (e) {
    console.log("POST /badges failed: ", e);
    return errorToResponse(e);
  }
}
