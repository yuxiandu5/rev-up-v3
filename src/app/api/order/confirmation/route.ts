import { NextRequest } from "next/server";
import { OrderConfirmationSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/lib/errors/AppError";
import { requireAuth } from "@/lib/auth-guard";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { OrderResponseDTO, toOrderDTO } from "@/types/DTO/MarketPlaceDTO";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { sessionId } = OrderConfirmationSchema.parse({
      sessionId: searchParams.get("sessionId") ?? "",
    });
    if (!sessionId) throw new BadRequestError("Session ID is required!");

    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;
    if (!userId) throw new UnauthorizedError("You are not authorized to access this resource!");

    const order = await prisma.order.findFirst({
      where: {
        stripeSessionId: sessionId,
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
    console.log("Error GET/order/confirmation/[sessionId]", error);
    return errorToResponse(error);
  }
}
