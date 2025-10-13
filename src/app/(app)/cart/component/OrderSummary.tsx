import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/Loading";
import { CreditCard } from "lucide-react";
import { CartItemDTO } from "@/types/DTO/MarketPlaceDTO";
import { useRouter } from "next/navigation";

interface OrderSummaryProps {
  cartItems: CartItemDTO[];
  isLoading: boolean;
  handleCheckout: () => void;
  formatPrice: (cents: number) => string;
  itemCount: number;
  subtotalCents: number;
}
export default function OrderSummary({
  cartItems,
  isLoading,
  handleCheckout,
  formatPrice,
  itemCount,
  subtotalCents,
}: OrderSummaryProps) {

  const router = useRouter();
  return (
    <div className="lg:col-span-1">
      <div className="flex flex-col justify-between bg-[var(--bg-dark3)] rounded-lg p-6 sticky top-4 h-full">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text1)] mb-6">Order Summary</h2>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text2)]">Subtotal ({itemCount} items)</span>
            <span className="text-[var(--text1)] font-medium">{formatPrice(subtotalCents)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[var(--text2)]">Shipping</span>
            <span className="text-[var(--text2)]">Calculated at checkout</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[var(--text2)]">Tax</span>
            <span className="text-[var(--text2)]">Calculated at checkout</span>
          </div>

          <div className="border-t border-[var(--bg-dark1)] pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-[var(--text1)]">Total</span>
              <span className="text-xl font-bold text-[var(--highlight)]">
                {formatPrice(subtotalCents)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            className="w-full py-3 text-base font-semibold"
            onClick={handleCheckout}
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loading size="sm" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout
              </div>
            )}
          </Button>

          <Button variant="outline" className="w-full" disabled={isLoading} onClick={() => router.push("/market-place")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
