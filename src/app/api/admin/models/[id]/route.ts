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
    const modelObj = await prisma.model.findUnique({
      where: { id },
      include: {
        badges: true,
      },
    });
    if (!modelObj) throw new NotFoundError("The model id does not exist!");
    if (modelObj.badges[0]) {
      throw new ConflictError("You cannot delete a model while it still has models assigned.");
    }

    const res = await prisma.model.delete({
      where: { id },
    });

    return ok(res, "model deleted!", 200);
  } catch (e) {
    console.log("Error DELETE/models[id]", e);
    return errorToResponse(e);
  }
}
