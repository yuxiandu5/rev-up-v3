"use client";

import { useEffect, useState } from "react";
import { modelColumns } from "./columns";
import { ModelTable } from "./ModelTable";
import { ModelResponseDTO } from "@/types/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";

export default function ModelPage() {
  const [modelData, setModelData] = useState<ModelResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchModels = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/models");
      if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);

      const data = await res.json();
      setModelData(data.data);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (!isInitialized) {
      setLoading(false);
      return;
    }

    fetchModels();
  }, [isInitialized]);

  const handleModelDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/models/${id}`, {
        method: "DELETE",
      });
      if(res.status === 409) return toast("You cannot delete a model while it still has badges assigned.")
      if (!res.ok) throw new Error(`Failed to delete model: ${res.status}`);

      toast("model deleted!");
      await fetchModels();
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading variant="spinner" />;
  }

  return (
    <section className="w-full h-full flex justify-center items-center">
      <div className="w-[95%] h-full">
        <ModelTable
          columns={modelColumns(handleModelDelete)}
          data={modelData}
          fetchModels={fetchModels}
        />
      </div>
    </section>
  );
}
