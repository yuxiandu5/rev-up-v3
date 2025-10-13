"use client";

import { useCallback, useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import OrderSummary from "./component/OrderSummary";
import Cart from "./component/Cart";
import { toast } from "sonner";

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const itemCount = useCartStore((state) => state.getItemCount());
  const cartItems = useCartStore((state) => state.getActiveCart());
  const subtotalCents = useCartStore((state) => state.getSubtotalCents());
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      removeItem(itemId);
    },
    [removeItem]
  );

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast("Checkout functionality would be implemented here!");
    }, 1000);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (!hydrated) return;

  return (
    <div className="flex flex-col max-w-7xl mx-auto h-full w-full px-4 pt-4 pb-14">
      <div className="mb-4 flex-1">
        <h1 className="text-3xl font-bold text-[var(--text1)] mb-2 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          Shopping Cart
        </h1>
        <p className="text-[var(--text2)]">
          {itemCount > 0 && hydrated
            ? `${itemCount} item${itemCount > 1 ? "s" : ""} in your cart`
            : "Your cart is empty"}
        </p>
      </div>

      <div className="flex-10 grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        <Cart
          cartItems={cartItems}
          isLoading={isLoading}
          clearCart={clearCart}
          formatPrice={formatPrice}
          removeItem={handleRemoveItem}
          updateQuantity={updateQuantity}
        />

        <OrderSummary
          cartItems={cartItems}
          isLoading={isLoading}
          handleCheckout={handleCheckout}
          formatPrice={formatPrice}
          itemCount={itemCount}
          subtotalCents={subtotalCents}
        />
      </div>
    </div>
  );
}
