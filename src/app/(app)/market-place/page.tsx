"use client";

import { Search, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMarketplace } from "@/hooks/useMarketplace";
import { MarketPlaceProductCard } from "./components/ProductCard";

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

export default function MarketPlacePage() {
  const { products, total, loading, error, filters, setFilters, refetch } = useMarketplace();

  const items = products;

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text1)] mb-2">Market Place</h1>
        <p className="text-[var(--text2)]">Discover and purchase amazing mods for your vehicle</p>
      </div>

      <SearchBar />

      <CategoryFilters />

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-[var(--text2)]">
          Showing {items.length} out of {total} results
        </div>
        <Button variant="outline" className="px-4 py-3">
          <SortAsc size={18} />
          <span className="ml-2">Sort</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <MarketPlaceProductCard key={item.id} product={item} />
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
