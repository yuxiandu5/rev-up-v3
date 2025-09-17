"use client";

import { useState, useEffect } from "react";
import { useApiClient } from "./useApiClient";
import { useAuthStore } from "@/stores/authStore";
import type { 
  BuildSummaryDTO, 
  ApiSuccessResponse,
  ApiErrorResponse 
} from "@/types/dtos";

// Legacy interface for backward compatibility
export interface Build {
  id: string;
  userId: string;
  selectedCar: Record<string, unknown>;
  baseSpecs: Record<string, unknown>;
  selectedMods: Record<string, unknown>;
  nickname?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Type guard to check if response is success or error
function isApiSuccessResponse<T>(response: unknown): response is ApiSuccessResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "data" in response
  );
}

function isApiErrorResponse(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response
  );
}

export const useBuilds = () => {
  const [builds, setBuilds] = useState<BuildSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApiClient();
  const { user, isInitialized } = useAuthStore();

  const fetchBuilds = async () => {
    // Don't fetch if user is not authenticated
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall("/api/builds");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch builds: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Handle new DTO response format
      if (isApiSuccessResponse<BuildSummaryDTO[]>(responseData)) {
        setBuilds(responseData.data);
      } else if (isApiErrorResponse(responseData)) {
        throw new Error(responseData.error);
      } else {
        // Fallback for legacy response format
        setBuilds(responseData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch builds");
      // eslint-disable-next-line no-console
      console.error("Error fetching builds:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBuild = async (buildId: string): Promise<void> => {
    try {
      const response = await apiCall(`/api/builds/${buildId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete build: ${response.status}`);
      }

      // Optimistically update the UI
      setBuilds(prev => prev.filter(build => build.id !== buildId));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting build:", err);
      throw err;
    }
  };

  const copyPublicUrl = (buildId: string) => {
    const publicUrl = `${window.location.origin}/api/builds/public/${buildId}`;
    navigator.clipboard.writeText(publicUrl);
    return publicUrl;
  };

  useEffect(() => {
    // Only fetch builds if user is authenticated and auth is initialized
    if (isInitialized && user) fetchBuilds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized]);

  return {
    builds,
    loading,
    error,
    refetch: fetchBuilds,
    deleteBuild,
    copyPublicUrl,
  };
};
