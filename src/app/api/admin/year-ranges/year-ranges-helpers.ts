import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors/AppError";

export async function ifYearRangeExist(id: string) {
  const existing = await prisma.modelYearRange.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("ModelYearRange not found!");
}
