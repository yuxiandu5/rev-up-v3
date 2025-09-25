import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { IdSchema, ModCategoryUpdateSchema } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors/AppError";
import { toSlug } from "@/lib/utils";


export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const existing =  await prisma.modCategory.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError("Mod category not found");
    
    const body = await req.json();
    const { name, description } = ModCategoryUpdateSchema.parse(body);

    const updatedModCategory = await prisma.modCategory.update({
      where: { id },
      data: { name, description, slug: name ? toSlug(name) : undefined },
    });

    return ok(updatedModCategory, "Mod category updated!", 200);
  } catch (e) {
    console.log("Unexpected error happened PATCH/mod-categories/[id]", e);
    return errorToResponse(e);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const modCategory = await prisma.modCategory.findUnique({
      where: { id },
    });
    if (!modCategory) throw new NotFoundError("Mod category not found");

    const res = await prisma.modCategory.delete({
      where: { id },
    });

    return ok(res, "Mod category deleted!", 200);
  } catch (e) {
    console.log("Unexpected error happened DELETE/mod-categories/[id]", e);
    return errorToResponse(e);
  }
}