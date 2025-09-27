"use client";

import { useEffect, useState } from "react";
import { modCategoryColumns } from "./columns";
import { ModCategoryTable } from "./ModCategoryTable";
import { ModCategoryResponseDTO } from "@/types/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";
import { UpdateModCategoryDialog } from "./UpdateModCategoryDialog";

export default function ModCategoriesPage() {
  const [modCategoryData, setModCategoryData] = useState<ModCategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<ModCategoryResponseDTO | null>(null);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchModCategories = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/mod-categories");
      if (!res.ok) throw new Error(`Failed to fetch mod categories: ${res.status}`);

      const data = await res.json();
      setModCategoryData(data.data);
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

    fetchModCategories();
  }, [isInitialized]);

  const handleModCategoryDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/mod-categories/${id}`, {
        method: "DELETE",
      });
      if (res.status === 409)
        return toast("You cannot delete a mod category while it still has mods assigned.");
      if (!res.ok) throw new Error(`Failed to delete mod category: ${res.status}`);

      toast("mod category deleted!");
      await fetchModCategories();
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

  const handleModCategoryEdit = async (id: string) => {
    const data = modCategoryData.find((modCategory) => modCategory.id === id);
    if (!data) return;
    setEditData(data);
    setOpenEditDialog(true);
  };

  if (loading) {
    return <Loading variant="spinner" />;
  }

  return (
    <section className="w-full h-full flex justify-center items-center">
      <div className="w-[95%] h-full">
        <ModCategoryTable
          columns={modCategoryColumns(handleModCategoryDelete, handleModCategoryEdit)}
          data={modCategoryData}
          fetchModCategories={fetchModCategories}
        />
      </div>
      <UpdateModCategoryDialog
        fetchData={fetchModCategories}
        open={openEditDialog}
        data={editData}
        setOpen={setOpenEditDialog}
      />
    </section>
  );
}
