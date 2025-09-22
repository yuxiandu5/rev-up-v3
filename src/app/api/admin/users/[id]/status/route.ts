import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { AdminToggleActiveSchema, UserIdFormatSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { ok, errorToResponse } from "@/lib/apiResponse";
import { ifUserExist, preventSelfDeletion } from "../../user-helper";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN"]);

    const { id } = UserIdFormatSchema.parse(await params);
    await ifUserExist(id);
    await preventSelfDeletion(req, id);

    const body = await req.json();
    const { isActive } = AdminToggleActiveSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id },
        data: { isActive },
        select: {
          id: true,
          userName: true,
          isActive: true,
          updatedAt: true,
        },
      });
      if (!updatedUser.isActive) {
        await tx.refreshToken.updateMany({
          where: { userId: id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }

      return updatedUser;
    });

    return ok(result, "User status updated!");
  } catch (error) {
    console.log("Unexpected error in PATCH/users/id/status", error);
    return errorToResponse(error);
  }
}
