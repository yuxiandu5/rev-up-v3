"use client";

import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/app/(app)/market-place/orders/components/OrderCard";
import { LoadingCard } from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import StatusFilter from "./components/StatusFilter";

type sortOptions =
  | "updatedAt_asc"
  | "updatedAt_desc"
  | "totalCents_asc"
  | "totalCents_desc"
  | "status_asc"
  | "status_desc";

export default function OrdersPage() {
  const { orders, total, loading, error, filters, setFilters, loadMore, hasMore } = useOrders();
  const router = useRouter();

  const handleStatusChange = (status: string) => {
    const statusValue = status === "all" ? undefined : (status as OrderStatus);
    setFilters({ status: statusValue });
  };

  const handleSortChange = (sort: string) => {
    setFilters({
      sort: sort as sortOptions,
    });
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/market-place/orders/${orderId}`);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--text1)]">Order History</h1>
        <p className="text-[var(--text2)]">View and manage your past orders</p>
      </div>
      <StatusFilter
        filters={filters}
        setFilters={setFilters}
        handleStatusChange={handleStatusChange}
        handleSortChange={handleSortChange}
      />

      <div className="space-y-4 h-full">
        {orders.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-[var(--text2)] mb-4">No orders found</p>
            <Button
              onClick={() => router.push("/market-place")}
              className="bg-[var(--highlight)] hover:bg-[var(--highlight)]/80 text-white"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => handleViewDetails(order.id)}
              />
            ))}

            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            )}

            {!loading && hasMore && (
              <div className="text-center pt-4">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  className="border-[var(--bg-dark3)] text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
                >
                  Load More Orders
                </Button>
              </div>
            )}

            {orders.length > 0 && (
              <div className="text-center pt-4">
                <p className="text-sm text-[var(--text2)]">
                  Showing {orders.length} of {total} orders
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
