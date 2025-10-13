import { Button } from "@/components/ui/button";
import { CartItemDTO } from "@/types/DTO/MarketPlaceDTO";
import CartItem from "./CartItem";

interface CartProps {
  cartItems: CartItemDTO[];
  isLoading: boolean;
  clearCart: () => void;
  formatPrice: (cents: number) => string;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
}

export default function Cart({
  cartItems,
  isLoading,
  clearCart,
  formatPrice,
  updateQuantity,
  removeItem,
}: CartProps) {
  return (
    <div className="flex flex-col bg-[var(--bg-dark3)] rounded-lg overflow-hidden lg:col-span-2 space-y-4 h-full">
      <div className="flex justify-between items-center p-6 border-b border-[var(--bg-dark1)]">
        <h2 className="text-xl font-semibold text-[var(--text1)]">Cart Items</h2>
        <Button
          variant="outline"
          onClick={clearCart}
          disabled={isLoading || cartItems.length === 0}
          className="text-red-400 border-red-400/20 hover:bg-red-400/10 hover:border-red-400/40"
        >
          Clear Cart
        </Button>
      </div>

      <div className="divide-y divide-[var(--bg-dark1)]">
        {cartItems.map((item, index) => (
          <CartItem
            key={item.id}
            item={item}
            index={index}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            isLoading={isLoading}
            formatPrice={formatPrice}
          />
        ))}
      </div>
    </div>
  );
}
