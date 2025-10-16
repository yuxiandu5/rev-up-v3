import { Stripe } from "stripe";

const STRIPE_CURRENCY = "aud";

type PrismaCartItem = {
  id: string;
  quantity: number;
  unitPriceCents: number;
  product: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string;
  };
};

export const createStripeLineItems = (
  items: PrismaCartItem[]
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: STRIPE_CURRENCY,
      product_data: {
        name: item.product.name,
        description: item.product.description || undefined,
        images:
          item.product.imageUrl && item.product.imageUrl !== "placeholder"
            ? [item.product.imageUrl]
            : undefined,
      },
      unit_amount: item.unitPriceCents,
    },
    quantity: item.quantity,
  }));

  return lineItems;
};

export const calculateTotalPrice = (items: PrismaCartItem[]): number => {
  return items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0);
};

