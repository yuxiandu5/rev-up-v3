import { errorToResponse, ok } from "@/lib/apiResponse";
import { BadRequestError, NotFoundError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      throw new BadRequestError("STRIPE_WEBHOOK_SECRET not configured");
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new BadRequestError("Stripe signature not found");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      throw new BadRequestError("Webhook signature verification failed");
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "checkout.session.expired":
        await handleCheckoutSessionExpired(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return ok({ received: true }, "Webhook processed successfully");

  } catch (error) {
    console.error("Webhook error:", error);
    return errorToResponse(error);
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  const cartId = session.metadata?.cartId;

  if (!orderId) {
    console.error(`No orderId in session metadata ${session.id}`);
    throw new BadRequestError(`No orderId in session metadata ${session.id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError(`Order with id ${orderId} not found`);
  }

  if(order.status === "PAID") {
    console.log(`Order ${orderId} already marked as PAID, skipping...`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        stripePaymentId: session.payment_intent as string,
      },
    });

    if (cartId) {
      await tx.cartItem.deleteMany({
        where: { cartId },
      });
    }
  });

  console.log(`Order ${orderId} marked as PAID`);
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error(`No orderId in session metadata for expired session ${session.id}`);
    throw new BadRequestError(`No orderId in session metadata for expired session ${session.id}`);
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  console.log(`Order ${orderId} marked as CANCELLED due to expired session`);
}