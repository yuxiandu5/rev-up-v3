import { prisma } from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors/AppError";
import { requireAuth } from "@/lib/auth-guard";
import { NextRequest } from "next/server";

export async function ifUserExist(id: string){
  const existing = await prisma.user.findUnique({ where: { id } });
  if(!existing) throw new NotFoundError("User not found!");
}

export async function preventSelfDeletion(req: NextRequest, id: string){
    const currentUser = await requireAuth(req);
    if (currentUser.sub === id) {
      throw new ForbiddenError("You cannot delete your own account");
    }
}