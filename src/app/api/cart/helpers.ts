import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors/AppError";
import { CartResponseDTO, toCartDTO } from "@/types/DTO/MarketPlaceDTO";

export async function fetchUserCart(userId: string): Promise<CartResponseDTO> {
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
      if(!cart) throw new NotFoundError("User Cart not found!")
  
      return toCartDTO(cart)
}