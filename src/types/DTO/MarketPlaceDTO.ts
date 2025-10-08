import { Product } from "@prisma/client";

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  price: {
    amountCents: number;
    currency: string;
    formatted: string; // "AUD 339.00"
  };
  stock: number | null;
  isActive: boolean;

  compatibility?: {
    id: string;
    make: string;
    model: string;
    badge: string;
    yearRange: string; // e.g. "2013–2018"
    hpGain?: number | null;
    nmGain?: number | null;
    handlingDelta?: number | null;
    zeroToHundredDelta?: number | null;
  } | null;

  mod: {
    id: string;
    brand?: string;
    category: string;
  };

  createdAt: string;
  updatedAt: string;
}

export function toProductDTO(
  product: Product & {
    mod: {
      id: string;
      name: string;
      brand: string;
      category: string;
    };
    compatibility?: {
      id: string;
      modelYearRange: string;
      modelYearRangeObj: {
        badge: {
          name: string;
          model: {
            name: string;
            make: {
              name: string;
            };
          };
        };
      };
      hpGain?: number | null;
      nmGain?: number | null;
      handlingDelta?: number | null;
      zeroToHundredDelta?: number | null;
    } | null;
  }
): ProductResponseDTO {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    price: {
      amountCents: product.priceCents,
      currency: product.currency,
      formatted: `${product.currency} ${(product.priceCents / 100).toFixed(2)}`,
    },
    stock: product.stock,
    isActive: product.isActive,
    compatibility: product.compatibility
      ? {
          id: product.compatibility.id,
          make: product.compatibility.modelYearRangeObj.badge.model.make.name,
          model: product.compatibility.modelYearRangeObj.badge.model.name,
          badge: product.compatibility.modelYearRangeObj.badge.name,
          yearRange: product.compatibility.modelYearRange,
          hpGain: product.compatibility.hpGain ?? undefined,
          nmGain: product.compatibility.nmGain ?? undefined,
          handlingDelta: product.compatibility.handlingDelta ?? undefined,
          zeroToHundredDelta: product.compatibility.zeroToHundredDelta ?? undefined,
        }
      : undefined,
    mod: {
      id: product.mod.id,
      brand: product.mod.brand ?? undefined,
      category: product.mod.category,
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export interface CartResponseDTO {
  id: string;
  items: CartItemDTO[];
  subtotalCents: number;
  itemCount: number;
}

export interface CartItemDTO {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  productImageUrl: string;
  unitPriceCents: number;
  quantity: number;
  totalPriceCents: number;
}

type PrismaCartWithItems = {
  id: string;
  items: {
    id: string;
    product: {
      id: string;
      name: string;
      description: string | null;
      imageUrl: string;
    };
    quantity: number;
    unitPriceCents: number;
  }[];
};

function toCartItemDTO(cartItem: PrismaCartWithItems["items"][0]): CartItemDTO {
  return {
    id: cartItem.id,
    productId: cartItem.product.id,
    productName: cartItem.product.name,
    productDescription: cartItem.product.description ?? "",
    productImageUrl: cartItem.product.imageUrl,
    unitPriceCents: cartItem.unitPriceCents,
    quantity: cartItem.quantity,
    totalPriceCents: cartItem.unitPriceCents * cartItem.quantity,
  };
}

export function toCartDTO(cart: PrismaCartWithItems): CartResponseDTO {
  const items = cart.items.map((item) => toCartItemDTO(item));

  const subtotalCents = items.reduce((acc, cur) => {
    return (acc += cur.totalPriceCents);
  }, 0);
  const itemCount = items.reduce((acc, cur) => {
    return (acc += cur.quantity);
  }, 0);

  return {
    id: cart.id,
    items: items,
    subtotalCents: subtotalCents,
    itemCount: itemCount,
  };
}
