import { Button } from "@/components/ui/button";
import { MarketPlacePaginationInput } from "@/lib/validations";
import { useModStore } from "@/stores/modStore";
import { useEffect } from "react";

interface CategoryFiltersProps {
  setFilters: (filters: Partial<MarketPlacePaginationInput>) => void;
  selectedCategory: string;
  loading: boolean;
}

export default function CategoryFilters({
  setFilters,
  selectedCategory,
  loading,
}: CategoryFiltersProps) {
  const categories = useModStore((state) => state.categories);
  const fetchCategories = useModStore((state) => state.fetchCategories);
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      <Button
        variant={selectedCategory === "" ? "default" : "outline"}
        className="whitespace-nowrap px-4 py-2 border border-transparent data-[variant=default]:border-primary data-[variant=outline]:border-input"
        onClick={() => {
          setFilters({
            category: "",
          });
        }}
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={
            category.name.toLowerCase() === selectedCategory?.toLowerCase() ? "default" : "outline"
          }
          className="whitespace-nowrap px-4 py-2 border border-transparent data-[variant=default]:border-primary data-[variant=outline]:border-input"
          onClick={() => {
            setFilters({
              category: category.name.toLowerCase(),
            });
          }}
          disabled={loading}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
