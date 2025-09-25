import { errorToResponse, okPaginated, ok } from "@/lib/apiResponse";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ModelCreateSchema, PaginationSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { toSlug } from "@/lib/utils";
import { NotFoundError } from "@/lib/errors/AppError";
import { ModelResponseDTO, toModelDTO } from "@/types/AdminDashboardDTO";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { searchParams } = new URL(req.url);

    const { page, pageSize } = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    const [modelData, totalModelCount] = await Promise.all([
      prisma.model.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          slug: true,
          make: {
            select: {
              name: true,
            },
          },
          badges: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.model.count(),
    ]);

    const modelDataFormatted: ModelResponseDTO[] = modelData.map(toModelDTO);

    return okPaginated(
      modelDataFormatted,
      page,
      pageSize,
      totalModelCount,
      "Successfully fetched model data!"
    );
  } catch (e) {
    console.log("Error GET/models", e);
    return errorToResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const body = await req.json();
    const { makeId, name, slug } = ModelCreateSchema.parse(body);

    const existing = await prisma.make.findUnique({
      where: { id: makeId },
    });
    if (!existing) throw new NotFoundError("Make id does not exist");

    const res = await prisma.model.create({
      data: {
        makeId,
        name,
        slug: slug ?? toSlug(name),
      },
    });

    return ok(res, "Model Created!", 201);
  } catch (e) {
    console.log("POST /models failed: ", e);
    return errorToResponse(e);
  }
}
