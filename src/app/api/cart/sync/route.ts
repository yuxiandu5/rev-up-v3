import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { syncCartSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { fetchUserCart } from "../helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestCartItems } = syncCartSchema.parse(body);

    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;

    if (guestCartItems.length === 0) {
      const cart = await fetchUserCart(userId);
      return ok(cart, "No items to sync");
    }

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: { updatedAt: new Date() },
      });

      for (const guestItem of guestCartItems) {
        const product = await tx.product.findFirst({
          where: { id: guestItem.productId, isActive: true },
        });

        if (!product) {
          continue;
        }

        await tx.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: guestItem.productId,
            },
          },
          update: {
            quantity: { increment: guestItem.quantity },
          },
          create: {
            cartId: cart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            unitPriceCents: product.priceCents,
          },
        });
      }
    });

    const updatedCart = await fetchUserCart(userId);
    return ok(updatedCart, "Cart synced successfully!");
  } catch (e) {
    console.log("POST /api/cart/sync error:", e);
    return errorToResponse(e);
  }
}
