import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/prisma";
import { addCartItemSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { CartResponseDTO, toCartDTO } from "@/types/DTO/MarketPlaceDTO";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity } = addCartItemSchema.parse(body);

    const userPayload = await requireAuth(req);
    const userId = userPayload.sub

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true }
    })
    if(!product) throw new NotFoundError(`Product with id ${productId} not found!`)

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: { updatedAt: new Date()}
      })
      await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        create: { cartId: cart.id, productId, quantity, unitPriceCents: product.priceCents },
        update: { quantity: { increment: quantity } }
      })
    })
    const updatedCart = await prisma.cart.findUnique({
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
    if(!updatedCart) throw new NotFoundError("User Cart not found!")

    const formattedCart: CartResponseDTO = toCartDTO(updatedCart)

    return ok(formattedCart, "Item added successfully!")
  } catch (e) {
    console.log("POST /api/cart/items error:", e);
    return errorToResponse(e);
  }
}