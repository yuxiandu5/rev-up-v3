import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { toModRequirementDTO } from "@/types/DTO/AdminDashboardDTO";
import { ModRequirementCreateSchema } from "@/lib/validations";
import { ConflictError } from "@/lib/errors/AppError";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ["ADMIN", "MODERATOR"]);

    const res = await prisma.modRequirement.findMany({
      select: {
        id: true,
        prerequisiteCategory: {
          select: {
            name: true,
          },
        },
        dependent: {
          select: {
            name: true,
            brand: true,
            category: true,
          },
        },
      },
    });

    const formatted = toModRequirementDTO(res);
    return ok(formatted, "Mod requirements fetched successfully", 200);
  } catch (error) {
    console.log("Unexpected error in GET /mod-requirements: ", error);
    return errorToResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, ["ADMIN", "MODERATOR"]);

    const body = await request.json();
    const { prerequisiteCategoryId, dependentId } = ModRequirementCreateSchema.parse(body);

    const existing = await prisma.modRequirement.findFirst({
      where: {
        prerequisiteCategoryId,
        dependentId,
      },
    });
    console.log("existing", existing);
    if (existing)
      throw new ConflictError(
        "Mod requirement with this prerequisite category and dependent already exists"
      );

    const res = await prisma.modRequirement.create({
      data: {
        prerequisiteCategoryId,
        dependentId,
      },
    });

    return ok(res, "Mod requirements created successfully", 200);
  } catch (error) {
    console.log("Unexpected error in POST /mod-requirements: ", error);
    return errorToResponse(error);
  }
}
