import { OrderResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Calendar, Package, DollarSign, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetailProps {
  order: OrderResponseDTO;
  onBack?: () => void;
}

export function OrderDetail({ order, onBack }: OrderDetailProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (cents: number, currency: string): string => {
    return `$${(cents / 100).toFixed(2)} ${currency}`;
  };

  const getTotalItems = (): number => {
    return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="flex flex-col items-start mb-6">
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text1)]">Order Details</h1>
          <p className="text-[var(--text2)]">Order #{order.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="bg-[var(--bg-dark2)] border border-[var(--bg-dark3)] rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[var(--text1)]">Order Status</h2>
            <div className="flex items-center space-x-4">
              <OrderStatusBadge status={order.status} />
              {order.stripeSessionId && (
                <div className="flex items-center text-sm text-[var(--text2)]">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Payment processed
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[var(--highlight)]">
              {formatCurrency(order.totalCents, order.currency)}
            </p>
            <p className="text-sm text-[var(--text2)]">Total amount</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[var(--bg-dark3)]">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-[var(--text2)] mr-2" />
            <div>
              <p className="text-sm text-[var(--text2)]">Ordered on</p>
              <p className="font-medium text-[var(--text1)]">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Package className="w-5 h-5 text-[var(--text2)] mr-2" />
            <div>
              <p className="text-sm text-[var(--text2)]">Items</p>
              <p className="font-medium text-[var(--text1)]">
                {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-[var(--text2)] mr-2" />
            <div>
              <p className="text-sm text-[var(--text2)]">Payment</p>
              <p className="font-medium text-[var(--text1)]">
                {order.stripePaymentId ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-dark2)] border border-[var(--bg-dark3)] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text1)]">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-4 border border-[var(--bg-dark3)] rounded-lg"
            >
              <div className="w-16 h-16 bg-[var(--bg-dark3)] rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-[var(--text2)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[var(--text1)]">{item.productName}</h3>
                <p className="text-sm text-[var(--text2)] mt-1">{item.productDescription}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-[var(--text1)]">
                  {formatCurrency(item.unitPriceCents, order.currency)}
                </p>
                <p className="text-sm text-[var(--text2)]">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-[var(--highlight)]">
                  {formatCurrency(item.totalPriceCents, order.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--bg-dark3)] mt-6 pt-4">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-lg font-semibold border-t border-[var(--bg-dark3)]">
                <span className="text-[var(--text1)]">Total</span>
                <span className="text-[var(--highlight)]">
                  {formatCurrency(order.totalCents, order.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
