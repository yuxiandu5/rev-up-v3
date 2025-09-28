"use client";

import { useEffect, useState } from "react";
import { modRequirementColumns } from "./columns";
import { ModRequirementTable } from "./ModRequirementTable";
import { ModRequirementResponseDTO } from "@/types/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";

export default function ModRequirementsPage() {
  const [modRequirementData, setModRequirementData] = useState<ModRequirementResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchModRequirements = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/mod-requirements");
      if (!res.ok) throw new Error(`Failed to fetch mod requirements: ${res.status}`);

      const data = await res.json();
      setModRequirementData(data.data || data);
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

    fetchModRequirements();
  }, [isInitialized]);

  const handleModRequirementDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/mod-requirements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete mod requirement: ${res.status}`);

      toast("Mod requirement deleted!");
      await fetchModRequirements();
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
        <ModRequirementTable
          columns={modRequirementColumns(handleModRequirementDelete)}
          data={modRequirementData}
          fetchModRequirements={fetchModRequirements}
        />
      </div>
    </section>
  );
}
