"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { MarketPlacePaginationInput } from "@/lib/validations";
import { toast } from "sonner";

interface UseMarketplaceReturn {
  filters: MarketPlacePaginationInput;
  products: ProductResponseDTO[];
  total: number;
  openDialog: boolean;
  selectedProduct: ProductResponseDTO | null;
  loading: boolean;
  error: string | null;
  setFilters: (filters: Partial<MarketPlacePaginationInput>) => void;
  refetch: () => void;
  loadMore: () => void;
  setSelectedProduct: (product: ProductResponseDTO) => void;
  setOpenDialog: (open: boolean) => void;
}

export function useMarketplace(): UseMarketplaceReturn {
  const initialFilters: MarketPlacePaginationInput = {
    page: 1,
    pageSize: 20,
    search: "",
    sort: "createdAt_desc",
    category: "",
    brand: "",
  };

  const [filters, setFiltersState] = useState<MarketPlacePaginationInput>(initialFilters);
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value != null && value !== "")
      );
      const params = new URLSearchParams(validFilters as Record<string, string>);
      const searchQuery = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/market-place${searchQuery}`);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      setProducts((prev) => {
        if (filters.page > 1 && prev.length > 0) {
          return [...prev, ...data.data];
        }
        return data.data;
      });
      setTotal(data.meta.total);
    } catch (e) {
      toast.error("Failed to fetch products");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setFilters = useCallback((newFilters: Partial<MarketPlacePaginationInput>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  const loadMore = useCallback(() => {
    setFiltersState((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const setSelectedProductState = useCallback((product: ProductResponseDTO) => {
    setSelectedProduct(product);
  }, []);

  const setOpenDialogState = useCallback((open: boolean) => {
    setOpenDialog(open);
  }, []);

  return {
    products,
    total,
    openDialog,
    selectedProduct,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchProducts,
    loadMore,
    setSelectedProduct: setSelectedProductState,
    setOpenDialog: setOpenDialogState,
  };
}
