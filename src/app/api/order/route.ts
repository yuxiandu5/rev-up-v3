import { requireAuth } from "@/lib/auth-guard";
import { errorToResponse, okPaginated } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { OrderPaginationSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { OrderResponseDTO, toOrderDTO } from "@/types/DTO/MarketPlaceDTO";

export async function GET(req: NextRequest) {
  try {
    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;

    const searchParams = req.nextUrl.searchParams;
    const { page, pageSize, sort, status } = OrderPaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && { status }),
    };

    let orderBy: Prisma.OrderOrderByWithRelationInput[] = [{ updatedAt: "desc" }, { id: "asc" }];

    switch (sort) {
      case "updatedAt_asc":
        orderBy = [{ updatedAt: "asc" }, { id: "asc" }];
        break;
      case "updatedAt_desc":
        orderBy = [{ updatedAt: "desc" }, { id: "asc" }];
        break;
      case "totalCents_asc":
        orderBy = [{ totalCents: "asc" }, { id: "asc" }];
        break;
      case "totalCents_desc":
        orderBy = [{ totalCents: "desc" }, { id: "asc" }];
        break;
      case "status_asc":
        orderBy = [{ status: "asc" }, { id: "asc" }];
        break;
      case "status_desc":
        orderBy = [{ status: "desc" }, { id: "asc" }];
        break;
    }


    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const formattedOrders: OrderResponseDTO[] = orders.map(toOrderDTO);

    return okPaginated(
      formattedOrders,
      page,
      pageSize,
      total,
      "Successfully fetched orders!"
    );
  } catch (error) {
    console.log("Error GET/order", error);
    return errorToResponse(error);
  }
}
