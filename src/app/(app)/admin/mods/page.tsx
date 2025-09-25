"use client";

import { useEffect, useState } from "react";
import { modColumns } from "./columns";
import { ModTable } from "./ModTable";
import { ModResponseDTO } from "@/types/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";
import { ModUpdateDialog } from "./ModUpdateDialog";

export default function ModPage() {
  const [modData, setModData] = useState<ModResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<ModResponseDTO | null>(null);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchMods = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/mods");
      if (!res.ok) throw new Error(`Failed to fetch mods: ${res.status}`);

      const data = await res.json();
      setModData(data.data);
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

    fetchMods();
  }, [isInitialized]);

  const handleModDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/mods/${id}`, {
        method: "DELETE",
      });
      if (res.status === 409)
        return toast("You cannot delete a mod while it still has badges assigned.");
      if (!res.ok) throw new Error(`Failed to delete mod: ${res.status}`);

      toast("mod deleted!");
      await fetchMods();
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

  const handleModUpdate = async (id: string) => {
    const data = modData.find((mod) => mod.id === id);
    if (!data) return;
    setUpdateData(data);
    setOpenUpdateDialog(true);
  };

  if (loading) {
    return <Loading variant="spinner" />;
  }

  return (
    <section className="w-full h-full flex justify-center items-center">
      <div className="w-[95%] h-full">
        <ModTable
          columns={modColumns(handleModDelete, handleModUpdate)}
          data={modData}
          fetchMods={fetchMods}
        />
      </div>
      <ModUpdateDialog fetchData={fetchMods} open={openUpdateDialog} data={updateData} setOpen={setOpenUpdateDialog} />
    </section>
  );
}
