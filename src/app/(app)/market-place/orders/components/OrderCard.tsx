import { OrderResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, DollarSign } from "lucide-react";

interface OrderCardProps {
  order: OrderResponseDTO;
  onViewDetails?: () => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (cents: number, currency: string): string => {
    return `$${(cents / 100).toFixed(2)} ${currency}`;
  };

  const getTotalItems = (): number => {
    return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="bg-[var(--bg-dark2)] border border-[var(--bg-dark3)] rounded-lg p-6 hover:border-[var(--highlight)] transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-[var(--text1)]">
            Order #{order.id.slice(-8).toUpperCase()}
          </h3>
          <div className="flex items-center text-sm text-[var(--text2)] mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(order.createdAt)}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Package className="w-4 h-4 text-[var(--text2)] mr-2" />
          <span className="text-sm text-[var(--text2)]">
            {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center justify-end">
          <DollarSign className="w-4 h-4 text-[var(--text2)] mr-1" />
          <span className="font-semibold text-lg text-[var(--highlight)]">
            {formatCurrency(order.totalCents, order.currency)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-[var(--text2)] mb-2">Items:</div>
        <div className="space-y-1">
          {order.orderItems.slice(0, 2).map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[var(--text1)] truncate mr-2">{item.productName}</span>
              <span className="text-[var(--text2)]">×{item.quantity}</span>
            </div>
          ))}
          {order.orderItems.length > 2 && (
            <div className="text-sm text-[var(--text2)]">
              +{order.orderItems.length - 2} more item{order.orderItems.length - 2 !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="hover:bg-[var(--bg-dark3)] border-[var(--bg-dark3)] text-[var(--text1)]"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
