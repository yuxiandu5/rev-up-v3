"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import OrderSummary from "./component/OrderSummary";
import Cart from "./component/Cart";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const itemCount = useCartStore((state) => state.getItemCount());
  const cartItems = useCartStore((state) => state.getActiveCart());
  const subtotalCents = useCartStore((state) => state.getSubtotalCents());
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const sortedCartItems = [...cartItems].sort((a, b) => a.id.localeCompare(b.id));
  const productCount = cartItems.length;

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleClearCart = () => {
    clearCart();
    setOpenDialog(false);
  };

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
          {productCount > 0 && hydrated
            ? `${productCount} item${productCount > 1 ? "s" : ""} in your cart`
            : "Your cart is empty"}
        </p>
      </div>

      <div className="flex-10 grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        <Cart
          cartItems={sortedCartItems}
          isLoading={isLoading}
          formatPrice={formatPrice}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
          setOpenDialog={setOpenDialog}
        />

        <OrderSummary
          cartItems={sortedCartItems}
          isLoading={isLoading}
          handleCheckout={handleCheckout}
          formatPrice={formatPrice}
          itemCount={itemCount}
          subtotalCents={subtotalCents}
        />
      </div>

      <ConfirmationDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleClearCart}
        title="Confirm Clear Cart"
        message="Are you sure you want to clear your cart?"
        confirmText="Clear"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
