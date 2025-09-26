import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, ok, okPaginated } from "@/lib/apiResponse";
import { ConflictError } from "@/lib/errors/AppError";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModCompatibilityCreateSchema, PaginationSchema, ManyIdSchema } from "@/lib/validations";
import { ModCompatibilityResponseDTO, toModCompatibilityDTO } from "@/types/AdminDashboardDTO";
import { NotFoundError } from "@/lib/errors/AppError";


export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { searchParams } = new URL(req.url);

    const { page, pageSize, q } = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });

    // Fetch all mod compatibilities with necessary relations
    const allModCompatibilities = await prisma.modCompatibility.findMany({
      select: {
        id: true,
        mod: {
          select: {
            name: true,
          },
        },
        modelYearRangeObj: {
          select: {
            startYear: true,
            endYear: true,
            badge: {
              select: {
                name: true,
                model: {
                  select: {
                    name: true,
                    make: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            }
          },
        },
        hpGain: true,
        nmGain: true,
        handlingDelta: true,
        zeroToHundredDelta: true,
        price: true,
        notes: true,
      },
    });

    // Filter results manually if query exists
    let filteredResults = allModCompatibilities;
    if (q) {
      const searchTerm = q.toLowerCase();
      const searchYear = parseInt(q);
      
      filteredResults = allModCompatibilities.filter(item => {
        // Create a combined car name for searching
        const makeName = item.modelYearRangeObj.badge.model.make.name.toLowerCase();
        const modelName = item.modelYearRangeObj.badge.model.name.toLowerCase();
        const badgeName = item.modelYearRangeObj.badge.name.toLowerCase();
        const yearRange = `${item.modelYearRangeObj.startYear}-${item.modelYearRangeObj.endYear || 'present'}`;
        const modName = item.mod.name.toLowerCase();
        
        const carName = `${makeName} ${modelName} ${badgeName} ${yearRange}`;
        
        // Search in car name, mod name, or year range
        return (
          carName.includes(searchTerm) ||
          modName.includes(searchTerm) ||
          (!isNaN(searchYear) && 
          searchYear >= item.modelYearRangeObj.startYear && 
          (item.modelYearRangeObj.endYear === null || searchYear <= item.modelYearRangeObj.endYear))
        );
      });
    }

    // Manual pagination
    const totalCount = filteredResults.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = filteredResults.slice(startIndex, startIndex + pageSize);

    const formattedResults: ModCompatibilityResponseDTO[] = paginatedResults.map(toModCompatibilityDTO);

    return okPaginated(formattedResults, page, pageSize, totalCount, "Successfully fetched mod compatibilities!");
  } catch (error) {
    console.log("Unexpected error happened GET/mod-compatibilities", error);
    return errorToResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const { modId, modelYearRangeId, badgeId, modelId, makeId, modelYearRange, hpGain, nmGain, handlingDelta, zeroToHundredDelta, price, notes } = ModCompatibilityCreateSchema.parse(await req.json());

    const existing = await prisma.modCompatibility.findFirst({
      where: { modId, modelYearRangeId },
    });
    if (existing) throw new ConflictError("Mod compatibility with this mod, model year range, badge, model, and make already exists");

    const modelYearRangeObj = await prisma.modelYearRange.findUnique({
      where: { id: modelYearRangeId },
    });
    if (!modelYearRangeObj) throw new NotFoundError("Model year range not found");

    const result = await prisma.modCompatibility.create({
      data: { modId, modelYearRangeId, badgeId, modelId, makeId, modelYearRange, hpGain, nmGain, handlingDelta, zeroToHundredDelta, price, notes },
    });

    return ok(result, "Mod compatibility created!", 201);
  } catch (error) {
    console.log("Unexpected error happened POST/mod-compatibilities", error);
    return errorToResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    const body = await req.json();
    const { ids } = ManyIdSchema.parse(body);

    // Validate that all IDs exist before attempting deletion
    const existingCompatibilities = await prisma.modCompatibility.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
      },
    });

    const existingIds = existingCompatibilities.map(item => item.id);
    const notFoundIds = ids.filter(id => !existingIds.includes(id));

    // Perform bulk delete
    const result = await prisma.modCompatibility.deleteMany({
      where: {
        id: {
          in: existingIds,
        },
      },
    });

    return ok(
      { 
        deletedCount: result.count,
        deletedIds: existingIds,
        notFoundIds: notFoundIds,
      }, 
      `Successfully deleted ${result.count} mod compatibility/compatibilities!`, 
      200
    );
  } catch (error) {
    console.log("Unexpected error happened DELETE/mod-compatibilities", error);
    return errorToResponse(error);
  }
}