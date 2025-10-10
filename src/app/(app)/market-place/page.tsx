"use client";

import { useState } from "react";
import { Search, Filter, SortAsc, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { MarketPlacePaginationInput } from "@/lib/validations";

function SearchBar() {
  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text2)]"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search mods, parts, accessories..."
          className="pl-10 pr-4 py-3 w-full bg-[var(--bg-dark2)] border-[var(--bg-dark3)] text-[var(--text1)]"
        />
      </div>
      <Button variant="outline" className="px-4 py-3">
        <Filter size={18} />
        <span className="ml-2">Filters</span>
      </Button>
      <Button variant="outline" className="px-4 py-3">
        <SortAsc size={18} />
        <span className="ml-2">Sort</span>
      </Button>
    </div>
  );
}

function CategoryFilters() {
  const categories = [
    "All Categories",
    "Engine Mods",
    "Suspension",
    "Exhaust",
    "Turbo",
    "Intake",
    "Wheels",
    "Brakes",
    "Electronics",
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === "All Categories" ? "default" : "outline"}
          className="whitespace-nowrap px-4 py-2"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

function MarketplaceItem({ id }: { id: number }) {
  return (
    <div className="bg-[var(--bg-dark2)] border border-[var(--bg-dark3)] rounded-lg overflow-hidden hover:border-[var(--highlight)] transition-all duration-200 group">
      {/* Image Placeholder */}
      <div className="aspect-square bg-[var(--bg-dark3)] flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-600 rounded-lg opacity-50"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--text1)] mb-2 group-hover:text-[var(--highlight)] transition-colors">
          Mod Item #{id}
        </h3>
        <p className="text-sm text-[var(--text2)] mb-3 line-clamp-2">
          High-performance mod for enhanced vehicle capabilities. Perfect condition with full
          documentation.
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-[var(--highlight)]">$299.99</div>
          <div className="text-sm text-[var(--text2)]">New</div>
        </div>

        <div className="flex items-center justify-between text-sm text-[var(--text2)] mb-4">
          <span>Seller: User{id}</span>
          <span>★ 4.8</span>
        </div>

        <Button className="w-full bg-[var(--accent)] hover:bg-[var(--highlight)]">
          View Details
        </Button>
      </div>
    </div>
  );
}

function ViewToggle() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-[var(--text2)] mr-2">View:</span>
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("grid")}
      >
        <Grid3X3 size={16} />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("list")}
      >
        <List size={16} />
      </Button>
    </div>
  );
}

export default function MarketPlacePage() {
  const [filters, setFilters] = useState<MarketPlacePaginationInput>({
    page: 1,
    pageSize: 20,
    search: "",
    category: "",
    brand: "",
    make: "",
    model: "",
    badge: "",
    year: 0,
    sort: "createdAt_desc",
  });
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text1)] mb-2">Market Place</h1>
        <p className="text-[var(--text2)]">Discover and purchase amazing mods for your vehicle</p>
      </div>

      <SearchBar />

      <CategoryFilters />

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-[var(--text2)]">Showing {items.length} results</div>
        <ViewToggle />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((id) => (
          <MarketplaceItem key={id} id={id} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" className="px-8 py-3">
          Load More Items
        </Button>
      </div>
    </div>
  );
}
