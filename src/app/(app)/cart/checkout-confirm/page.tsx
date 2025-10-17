"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiCall } from "@/lib/apiClients";
import { OrderResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import GreenTick from "@/components/GreenTick";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CheckoutConfirmPage() {
  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const router = useRouter();

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiCall(`/api/order/confirmation?session_id=${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const { data } = await res.json();
      return data;
    } catch {
      toast.error("Failed to fetch order");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !isInitialized) return;
    fetchOrder().then((orderData) => {
      if (orderData) {
        setOrder(orderData);
      }
    });
  }, [sessionId, fetchOrder, isInitialized]);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark2)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--highlight)] mx-auto mb-4"></div>
          <p className="text-[var(--text2)]">Loading your order confirmation...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark2)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text1)] mb-2">Order Not Found</h1>
          <p className="text-[var(--text2)] mb-6">
            We couldn&apos;t find your order. Please check your order history or contact support.
          </p>
          <Button
            onClick={() => router.push("/market-place/orders")}
            className="bg-[var(--highlight)] hover:bg-[var(--highlight)]/90"
          >
            View Order History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[var(--bg-dark2)] flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <GreenTick />
          <h1 className="text-3xl font-bold text-[var(--text1)] mt-6 mb-2">Payment Successful!</h1>
          <p className="text-[var(--text2)] text-lg mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-[var(--bg-dark3)] rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text2)]">Order ID</span>
                <span className="text-[var(--text1)] font-mono">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text2)]">Total</span>
                <span className="text-xl font-bold text-[var(--highlight)]">
                  {formatPrice(order.totalCents)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text2)]">Status</span>
                <span className="text-[var(--green)] font-medium capitalize">
                  {order.status.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <Button
              onClick={() => router.push("/market-place/orders/")}
              className="flex-1 bg-[var(--highlight)] hover:bg-[var(--highlight)]/90"
            >
              View Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/market-place")}
              className="flex-1 border-[var(--border)] text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
