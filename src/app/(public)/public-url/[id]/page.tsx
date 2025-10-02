"use client";

import { useEffect, useState, use } from "react";
import { BuildDetailDTO } from "@/types/DTO/dtos";
import PublicCard from "@/components/gallery-page/PublicCard";
import { Loading } from "@/components/ui/Loading";
import { NotFoundError, NoDataError, ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function PublicUrlPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BuildDetailDTO | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  const { id } = use(params);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(undefined);
      setNotFound(false);

      const response = await fetch(`/api/builds/public/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (response.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const dataJson = await response.json();

      // Validate response structure
      if (!dataJson.data || !dataJson.data.id) {
        throw new Error("Invalid response format");
      }

      setData(dataJson.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return <Loading variant="spinner" size="lg" />;
  }

  // Not found state
  if (notFound) {
    return <NotFoundError item="build" itemId={id} onRetry={fetchData} />;
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }

  // No data state
  if (!data) {
    return <NoDataError item="build data" onRetry={fetchData} />;
  }

  // Success state
  return (
    <div className="min-h-screen bg-[var(--bg-dark3)]">
      <PublicCard build={data} />
    </div>
  );
}
