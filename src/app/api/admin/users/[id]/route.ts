import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserIdFormatSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { ifUserExist, preventSelfDeletion } from "../../user-helper";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, ["ADMIN"]);

    const { id } = UserIdFormatSchema.parse(await params);

    await ifUserExist(id);
    await preventSelfDeletion(req, id);

    const result = await prisma.user.delete({
      where: { id },
      select: { id: true, userName: true, role: true, isActive: true },
    });

    return ok(result, "User deleted successfully!");
  } catch (error) {
    console.log("Unexpected error in DELETE/users/id/", error);
    return errorToResponse(error);
  }
}
