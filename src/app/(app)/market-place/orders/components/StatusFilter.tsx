import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderPaginationInput } from "@/lib/validations";
import { OrderStatus } from "@prisma/client";

interface StatusFilterProps {
  filters: OrderPaginationInput;
  setFilters: (filters: Partial<OrderPaginationInput>) => void;
  handleStatusChange: (status: string) => void;
  handleSortChange: (sort: string) => void;
}

export default function StatusFilter({
  filters,
  setFilters,
  handleStatusChange,
  handleSortChange,
}: StatusFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-48 bg-[var(--bg-dark2)] border-[var(--bg-dark3)] text-[var(--text1)]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--bg-dark2)] border-[var(--bg-dark3)]">
            <SelectItem value="all" className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]">
              All Orders
            </SelectItem>
            <SelectItem
              value={OrderStatus.PENDING}
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Pending
            </SelectItem>
            <SelectItem
              value={OrderStatus.PAID}
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Paid
            </SelectItem>
            <SelectItem
              value={OrderStatus.FAILED}
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Failed
            </SelectItem>
            <SelectItem
              value={OrderStatus.CANCELLED}
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select value={filters.sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-48 bg-[var(--bg-dark2)] border-[var(--bg-dark3)] text-[var(--text1)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--bg-dark2)] border-[var(--bg-dark3)]">
            <SelectItem
              value="updatedAt_desc"
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Newest First
            </SelectItem>
            <SelectItem
              value="updatedAt_asc"
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Oldest First
            </SelectItem>
            <SelectItem
              value="totalCents_desc"
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Highest Amount
            </SelectItem>
            <SelectItem
              value="totalCents_asc"
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Lowest Amount
            </SelectItem>
            <SelectItem
              value="status_asc"
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Status A-Z
            </SelectItem>
            <SelectItem
              value="status_desc"
              className="text-[var(--text1)] hover:bg-[var(--bg-dark3)]"
            >
              Status Z-A
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
