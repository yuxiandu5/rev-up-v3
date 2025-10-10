import { ProductResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { CartItemDTO } from "@/types/DTO/MarketPlaceDTO";

export function productToCartItem(
  product: ProductResponseDTO,
  quantity: number = 1
): CartItemDTO {
  return {
    id: product.id,
    productId: product.id,
    productName: product.name,
    productDescription: product.description ?? "",
    productImageUrl: product.imageUrl,
    unitPriceCents: product.price.amountCents,
    quantity,
    totalPriceCents: product.price.amountCents * quantity
  };
}