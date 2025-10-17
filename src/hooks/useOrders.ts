"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { OrderPaginationInput } from "@/lib/validations";
import { apiCall } from "@/lib/apiClients";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

interface UseOrdersReturn {
  orders: OrderResponseDTO[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: OrderPaginationInput;
  setFilters: (filters: Partial<OrderPaginationInput>) => void;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useOrders(): UseOrdersReturn {
  const initialFilters: OrderPaginationInput = {
    page: 1,
    pageSize: 10,
    sort: "updatedAt_desc",
  };

  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<OrderPaginationInput>(initialFilters);

  const { isInitialized } = useAuthStore();

  const buildQueryParams = useCallback((currentFilters: OrderPaginationInput): string => {
    const params = new URLSearchParams();
    params.set("page", currentFilters.page.toString());
    params.set("pageSize", currentFilters.pageSize.toString());
    params.set("sort", currentFilters.sort);

    if (currentFilters.status) {
      params.set("status", currentFilters.status);
    }

    return params.toString();
  }, []);

  const fetchOrders = useCallback(
    async (currentFilters: OrderPaginationInput, append = false): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = buildQueryParams(currentFilters);
        const response = await apiCall(`/api/order?${queryParams}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders");
        }

        const data = await response.json();

        if (append) {
          setOrders((prevOrders) => [...prevOrders, ...data.data]);
        } else {
          setOrders(data.data);
        }

        setTotal(data.meta.total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [buildQueryParams]
  );

  const setFilters = useCallback((newFilters: Partial<OrderPaginationInput>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }));
  }, []);

  const refetch = useCallback(() => {
    fetchOrders(filters, false);
  }, [filters, fetchOrders]);

  const loadMore = useCallback(() => {
    if (!loading && orders.length < total) {
      const nextPage = filters.page + 1;
      const nextFilters = { ...filters, page: nextPage };
      setFiltersState(nextFilters);
      fetchOrders(nextFilters, true);
    }
  }, [filters, orders.length, total, loading, fetchOrders]);

  const hasMore = orders.length < total && !loading;

  useEffect(() => {
    if (!isInitialized) return;
    fetchOrders(filters, false);
  }, [filters.sort, filters.status, isInitialized]);

  return {
    orders,
    total,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    loadMore,
    hasMore,
  };
}
