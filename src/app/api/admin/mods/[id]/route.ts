import { NotFoundError } from "@/lib/errors/AppError";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/utils";
import { IdSchema, ModUpdateSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const existing = await prisma.mod.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError("Mod not found");

    const body = await req.json();
    const { name, brand, category, description } = ModUpdateSchema.parse(body);

    const updatedMod = await prisma.mod.update({
      where: { id },
      data: { name, brand, category, description, slug: name ? toSlug(name) : undefined },
    });

    return ok(updatedMod, "Mod updated!", 200);
  } catch (e) {
    console.log("Unexpected error happened PATCH/mods/[id]", e);
    return errorToResponse(e);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const mod = await prisma.mod.findUnique({
      where: { id },
    });
    if (!mod) throw new NotFoundError("Mod not found");

    const res = await prisma.mod.delete({
      where: { id },
    });

    return ok(res, "Mod deleted!", 200);
  } catch (e) {
    console.log("Unexpected error happened DELETE/mods/[id]", e);
    return errorToResponse(e);
  }
}
