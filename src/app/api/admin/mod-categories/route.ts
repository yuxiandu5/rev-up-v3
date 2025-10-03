import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { ModCategoryResponseDTO, toModCategoryDTO } from "@/types/DTO/AdminDashboardDTO";
import { ModCategoryCreateSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";
import { BadRequestError } from "@/lib/errors/AppError";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const modCategories = await prisma.modCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        mods: {
          select: {
            name: true,
          },
        },
      },
    });
    const modCategoriesFormatted: ModCategoryResponseDTO[] = modCategories.map(toModCategoryDTO);

    return ok(modCategoriesFormatted, "Successfully fetched mod categories!", 200);
  } catch (e) {
    console.log("Unexpected error happened GET/mod-categories", e);
    return errorToResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const body = await req.json();
    const { name, description } = ModCategoryCreateSchema.parse(body);

    const existing = await prisma.modCategory.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) throw new BadRequestError("Mod category with this name already exists");

    const newModCategory = await prisma.modCategory.create({
      data: { name, description, slug: toSlug(name) },
    });

    return ok(newModCategory, "Mod category created!", 201);
  } catch (e) {
    console.log("Unexpected error happened POST/mod-categories", e);
    return errorToResponse(e);
  }
}
