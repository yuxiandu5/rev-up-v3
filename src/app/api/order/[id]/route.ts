import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/prisma";
import { IdSchema } from "@/lib/validations";
import { OrderResponseDTO, toOrderDTO } from "@/types/DTO/MarketPlaceDTO";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;

    const { id } = IdSchema.parse(await context.params);

    const order = await prisma.order.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) throw new NotFoundError("Order not found!");

    const formattedOrder: OrderResponseDTO = toOrderDTO(order);

    return ok(formattedOrder, "Order fetched successfully!");
  } catch (error) {
    console.log("Error GET/order/[id]", error);
    return errorToResponse(error);
  }
}
