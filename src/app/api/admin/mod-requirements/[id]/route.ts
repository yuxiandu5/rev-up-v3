import { requireRole } from "@/lib/auth-guard";
import { NextRequest } from "next/server";
import { IdSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors/AppError";
import { errorToResponse, ok } from "@/lib/apiResponse";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(request, ["ADMIN", "MODERATOR"]);

    const { id } = IdSchema.parse(await context.params);
    const existing = await prisma.modRequirement.findFirst({
      where: { id },
    });
    if (!existing) throw new NotFoundError("Mod requirement not found");

    const res = await prisma.modRequirement.delete({
      where: { id },
    });

    return ok(res, "Mod requirement deleted!", 200);
  } catch (error) {
    console.log("Unexpected error in DELETE /mod-requirements/[id]: ", error);
    return errorToResponse(error);
  }
}