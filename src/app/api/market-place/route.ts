import { ProductResponseDTO, toProductDTO } from "./../../../types/DTO/MarketPlaceDTO";
import { NextRequest } from "next/server";
import { errorToResponse, okPaginated } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { MarketPlacePaginationSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, search, sort, category, brand, make, model, badge, year } =
      MarketPlacePaginationSchema.parse({
        page: searchParams.get("page") ?? undefined,
        pageSize: searchParams.get("pageSize") ?? undefined,
        search: searchParams.get("search") ?? undefined,
        sort: searchParams.get("sort") ?? undefined,
        category: searchParams.get("category") ?? undefined,
        brand: searchParams.get("brand") ?? undefined,
        make: searchParams.get("make") ?? undefined,
        model: searchParams.get("model") ?? undefined,
        badge: searchParams.get("badge") ?? undefined,
        year: searchParams.get("year") ?? undefined,
      });

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { mod: { brand: { contains: search, mode: "insensitive" } } },
          { mod: { category: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(category && { mod: { category: category } }),
      ...(brand && { mod: { brand: brand } }),
      ...(make && {
        compatibility: { modelYearRangeObj: { badge: { model: { make: { name: make } } } } },
      }),
      ...(model && { compatibility: { modelYearRangeObj: { badge: { model: { name: model } } } } }),
      ...(badge && { compatibility: { modelYearRangeObj: { badge: { name: badge } } } }),
      ...(year && {
        compatibility: { modelYearRangeObj: { startYear: { lte: year }, endYear: { gte: year } } },
      }),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "asc" }, { id: "asc" }];

    switch (sort) {
      case "price_asc":
        orderBy = [{ priceCents: "asc" }];
        break;
      case "price_desc":
        orderBy = [{ priceCents: "desc" }];
        break;
      case "createdAt_asc":
        orderBy = [{ createdAt: "asc" }, { id: "asc" }];
        break;
      case "createdAt_desc":
        orderBy = [{ createdAt: "desc" }, { id: "asc" }];
        break;
    }

    const [data, count] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          mod: {
            select: {
              id: true,
              name: true,
              brand: true,
              category: true,
              media: {
                select: {
                  url: true,
                },
              },
            },
          },
          compatibility: {
            select: {
              id: true,
              modelYearRange: true,
              modelYearRangeObj: {
                select: {
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
                  },
                },
              },
              hpGain: true,
              nmGain: true,
              handlingDelta: true,
              zeroToHundredDelta: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedData: ProductResponseDTO[] = data.map(toProductDTO);

    return okPaginated(formattedData, page, pageSize, count, "Successfully fetched products data!");
  } catch (e) {
    console.log("Unexpected error in GET /market-place: ", e);
    return errorToResponse(e);
  }
}
