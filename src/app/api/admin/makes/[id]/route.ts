import { ConflictError, NotFoundError } from "@/lib/errors/AppError";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { IdSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);
    const { id } = IdSchema.parse(await context.params);
    const makeObj = await prisma.make.findUnique({
      where: { id },
      include: {
        models: true,
      },
    });
    if (!makeObj) throw new NotFoundError("The make id does not exist!");
    if (makeObj.models[0]) {
      throw new ConflictError("You cannot delete a make while it still has models assigned.");
    }

    const res = await prisma.make.delete({
      where: { id },
    });

    return ok(res, "Make deleted!", 200);
  } catch (e) {
    console.log("Error DELETE/makes[id]", e);
    return errorToResponse(e);
  }
}
