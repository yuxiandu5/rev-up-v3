import { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

interface StatusConfig {
  label: string;
  className: string;
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  },
  PAID: {
    label: "Paid",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  },
};

export function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className} font-medium text-xs px-2 py-1`}
    >
      {config.label}
    </Badge>
  );
}
