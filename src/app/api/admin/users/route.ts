import { PaginationSchema, UserFilterSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, okPaginated } from "@/lib/apiResponse";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN"]);

    const { searchParams } = new URL(req.url);

    const { page, pageSize } = PaginationSchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    });

    const { userName, role, isActive } = UserFilterSchema.parse({
      userName: searchParams.get("userName"),
      role: searchParams.get("role"),
      isActive: searchParams.get("isActive"),
    });

    const where: Prisma.UserWhereInput = {
      ...(userName ? { userName: {contains: userName, mode: "insensitive" }} : {}),
      ...(role ? { role } : {}),
      ...(typeof isActive === "boolean" ? {isActive} : {})
    };

    const users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      where,
      take: pageSize,
      select: {
        id: true,
        userName: true,
        isActive: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const totalUsers = await prisma.user.count({where});

    return okPaginated(users, page, pageSize, totalUsers, "Successfully fetched all users!", 200);

  } catch (error) {
    console.log("Unexpected error in GET /users:", error);
    return errorToResponse(error);
  }
}