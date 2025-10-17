"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiCall } from "@/lib/apiClients";
import { OrderResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { toast } from "sonner";
import { OrderDetail } from "../../market-place/orders/components/OrderDetail";
import { useAuthStore } from "@/stores/authStore";

export default function CheckoutConfirmPage() {

  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await apiCall(`/api/order/confirmation?session_id=${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const { data } = await res.json();
      return data;
    } catch {
      toast.error("Failed to fetch order");
      return null;
    }
  }, [sessionId]);
  
  useEffect(() => {
    if(!sessionId || !isInitialized) return;
    fetchOrder().then((orderData) => {
      if (orderData) {
        setOrder(orderData);
      }
    });
  }, [sessionId, fetchOrder, isInitialized]);

  if (!order) return <div>Loading...</div>;

  return (
  <div className="container mx-auto px-4 py-8">
    <OrderDetail order={order} />
  </div>);
}
