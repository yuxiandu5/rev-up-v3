import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/prisma";
import { addCartItemSchema, deleteCartItemSchema, updateCartItemSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { CartResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { fetchUserCart } from "../helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity } = addCartItemSchema.parse(body);

    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });
    if (!product) throw new NotFoundError(`Product with id ${productId} not found!`);

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: { updatedAt: new Date() },
      });
      await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        create: { cartId: cart.id, productId, quantity, unitPriceCents: product.priceCents },
        update: { quantity: { increment: quantity } },
      });
    });

    const formattedCart: CartResponseDTO = await fetchUserCart(userId);

    return ok(formattedCart, "Item added successfully!");
  } catch (e) {
    console.log("POST /api/cart/items error:", e);
    return errorToResponse(e);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItemId, quantity } = updateCartItemSchema.parse(body);

    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new NotFoundError("Cart item not found");
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    const formattedCart: CartResponseDTO = await fetchUserCart(userId);

    return ok(formattedCart, "Cart item updated successfully!");
  } catch (e) {
    console.log("PATCH /api/cart/items error:", e);
    return errorToResponse(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItemId } = deleteCartItemSchema.parse(body);

    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });
    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new NotFoundError("Cart item not found");
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    const formattedCart: CartResponseDTO = await fetchUserCart(userId);

    return ok(formattedCart, "Cart item deleted successfully!");
  } catch (e) {
    return errorToResponse(e);
  }
}
