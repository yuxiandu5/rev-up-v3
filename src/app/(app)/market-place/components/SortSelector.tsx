import { SortAsc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketPlacePaginationInput } from "@/lib/validations";

interface SortSelectorProps {
  filters: MarketPlacePaginationInput;
  setFilters: (filters: Partial<MarketPlacePaginationInput>) => void;
}

export default function SortSelector({ filters, setFilters }: SortSelectorProps) {
  return (
    <Select
      value={filters.sort ?? "createdAt_desc"}
      onValueChange={(value) =>
        setFilters({
          sort: value as "price_asc" | "price_desc" | "createdAt_asc" | "createdAt_desc",
        })
      }
    >
      <SelectTrigger className="min-w-[180px]">
        <SortAsc size={18} className="mr-2" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="createdAt_asc">Date: Oldest First</SelectItem>
        <SelectItem value="createdAt_desc">Date: Newest First</SelectItem>
      </SelectContent>
    </Select>
  );
}
