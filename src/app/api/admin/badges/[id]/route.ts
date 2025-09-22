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
    const badgeObj = await prisma.badge.findUnique({
      where: { id },
      include: {
        yearRanges: true,
      },
    });
    if (!badgeObj) throw new NotFoundError("The badge id does not exist!");
    if (badgeObj.yearRanges[0]) {
      throw new ConflictError("You cannot delete a badge while it still has models assigned.");
    }

    const res = await prisma.badge.delete({
      where: { id },
    });

    return ok(res, "badge deleted!", 200);
  } catch (e) {
    console.log("Error DELETE/badges[id]", e);
    return errorToResponse(e);
  }
}
