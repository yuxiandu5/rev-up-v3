import { errorToResponse, ok } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { calculateTotalPrice, createStripeLineItems } from "@/app/api/checkout-session/helper";
import { NextRequest } from "next/server";
import { CreateCheckoutSessionResponseDTO } from "@/types/DTO/MarketPlaceDTO";

const CURRENCY = "AUD";

export async function POST(req: NextRequest) {
  try {
    const userPayload = await requireAuth(req);
    const userId = userPayload.sub;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundError("Cart does not exist or is empty");
    }

    const totalCents = calculateTotalPrice(cart.items);
    const lineItems = createStripeLineItems(cart.items);
    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    }));

      const order = await prisma.order.create({
        data: {
          userId,
          totalCents,
          currency: CURRENCY,
          status: "PENDING",
          orderItems: {
            create: orderItems,
          },
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.APP_BASE_URL}/orders/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_BASE_URL}/cart`,
        metadata: {
          orderId: order.id,
          cartId: cart.id,
        },
        branding_settings: {
          background_color: "#1a1a1a",
        },
      });

      if (!session.id || !session.url) {
        throw new Error("Failed to create Stripe checkout session");
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

    return ok({
      sessionId: session.id,
      stripeUrl: session.url,
    }, "Checkout session created successfully");
  } catch (e) {
    console.log("POST /api/checkout-session error:", e);
    return errorToResponse(e);
  }
}
