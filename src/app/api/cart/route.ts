
import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { CartResponseDTO, toCartDTO } from "@/types/DTO/MarketPlaceDTO";
import { NextRequest } from "next/server";


export async function GET(req:NextRequest) {
  try {
    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;
    
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true
              }
            },
            quantity: true,
            unitPriceCents: true
          }
        },
      }
    });

    if(!cart) {
      return ok({
        id: null,
        items: [],
        subtotalCents: 0,
        itemCount: 0
      }, "Cart is empty")
    }

    const formattedCart: CartResponseDTO = toCartDTO(cart)

    return ok(formattedCart,"Cart fetched successfully!");
  } catch (e) {
    console.log(e);
    return errorToResponse(e)
  }
}