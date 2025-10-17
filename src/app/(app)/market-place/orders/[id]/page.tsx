"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { OrderDetail } from "@/app/(app)/market-place/orders/components/OrderDetail";
import { LoadingCard } from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiCall } from "@/lib/apiClients";
import { toast } from "sonner";

interface OrderApiResponse {
  success: boolean;
  data: OrderResponseDTO;
  message: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(`/api/order/${orderId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order");
        }

        const data: OrderApiResponse = await response.json();
        setOrder(data.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch order";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleBack = () => {
    router.push("/market-place/orders");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-[var(--bg-dark3)] text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetail order={order} onBack={handleBack} />
    </div>
  );
}
