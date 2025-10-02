import { Product } from "@prisma/client"

export interface ProductResponseDTO {
  id: string
  name: string
  description: string | null
  price: {
    amountCents: number
    currency: string
    formatted: string // "AUD 339.00"
  }
  stock: number | null
  isActive: boolean

  compatibility?: {
    id: string
    make: string
    model: string
    badge: string
    yearRange: string // e.g. "2013–2018"
  } | null

  mod: {
    id: string
    brand?: string
    category: string
  }

  createdAt: string
  updatedAt: string
}

export function toProductDTO(
  product: Product & { 
    mod: {
      id: string,
      name: string,
      brand: string,
      category: string
    }
    compatibility?: {
      id: string
      modelYearRange: string,
      modelYearRangeObj: {
        badge: {
          name: string,
          model: {
            name: string,
            make: {
              name: string
            }
          }
        }
      }
    } | null
  }
): ProductResponseDTO {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: {
      amountCents: product.priceCents,
      currency: product.currency,
      formatted: `${product.currency} ${(product.priceCents / 100).toFixed(2)}`
    },
    stock: product.stock,
    isActive: product.isActive,
    compatibility: product.compatibility
      ? {
          id: product.compatibility.id,
          make: product.compatibility.modelYearRangeObj.badge.model.make.name,
          model: product.compatibility.modelYearRangeObj.badge.model.name,
          badge: product.compatibility.modelYearRangeObj.badge.name,
          yearRange: product.compatibility.modelYearRange
        }
      : undefined,
    mod: {
      id: product.mod.id,
      brand: product.mod.brand ?? undefined,
      category: product.mod.category
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}
