import { errorToResponse, ok } from "@/lib/apiResponse";
import { NotFoundError } from "@/lib/errors/AppError";
import { requireRole } from "@/lib/auth-guard";
import { NextRequest } from "next/server";
import { IdSchema, ModCompatibilityUpdateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const existing = await prisma.modCompatibility.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError("Mod compatibility not found");

    const body = await req.json();
    const { hpGain, nmGain, handlingDelta, zeroToHundredDelta, price, notes } = ModCompatibilityUpdateSchema.parse(body);

    const result = await prisma.modCompatibility.update({
      where: { id },
      data: { hpGain, nmGain, handlingDelta, zeroToHundredDelta, price, notes },
    });

    return ok(result, "Mod compatibility updated!", 200);
  } catch (error) {
    console.log("Unexpected error happened PATCH/mod-compatibilities/[id]", error);
    return errorToResponse(error);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const existing = await prisma.modCompatibility.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError("Mod compatibility not found");

    const result = await prisma.modCompatibility.delete({
      where: { id },
    });

    return ok(result, "Mod compatibility deleted!", 200);
  } catch (error) {
    console.log("Unexpected error happened DELETE/mod-compatibilities/[id]", error);
    return errorToResponse(error);
  }
}
