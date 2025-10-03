import { NextRequest } from "next/server";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { IdSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors/AppError";
import { toProductDTO } from "@/types/DTO/MarketPlaceDTO";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = IdSchema.parse(await context.params);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        mod: {
          select: {
            id: true,
            name: true,
            brand: true,
            category: true,
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
          },
        },
      },
    });
    if (!product) throw new NotFoundError("Product not found!");

    const formattedProduct = toProductDTO(product);

    return ok(formattedProduct, "Product fetched!", 200);
  } catch (e) {
    console.log("Unexpected error in GET /market-place/:id: ", e);
    return errorToResponse(e);
  }
}
