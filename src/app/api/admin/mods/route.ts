import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireRole } from "@/lib/auth-guard";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModResponseDTO, toModDTO } from "@/types/AdminDashboardDTO";
import { ModCreateSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";
import { ConflictError } from "@/lib/errors/AppError";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const mods = await prisma.mod.findMany({
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        description: true,
        compatibilities: {
          select: {
            id: true,
          },
        },
      },
    });

    const modsFormatted: ModResponseDTO[] = mods.map(toModDTO);

    return ok(modsFormatted, "Successfully fetched mods!", 200);
  } catch (e) {
    console.log("Unexpected error happened GET/mods", e);
    return errorToResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const body = await req.json();
    const { name, brand, category, description, modCategoryId } = ModCreateSchema.parse(body);

    const existing = await prisma.mod.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) throw new ConflictError("Mod with this name already exists");

    const newMod = await prisma.mod.create({
      data: { name, brand, category, description, slug: toSlug(name), modCategoryId },
    });

    return ok(newMod, "Mod created!", 201);
  } catch (e) {
    console.log("Unexpected error happened POST/mods", e);
    return errorToResponse(e);
  }
}
