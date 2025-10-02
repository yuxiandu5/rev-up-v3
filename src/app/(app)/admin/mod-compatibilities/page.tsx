"use client";

import { useEffect, useState } from "react";
import { modCompatibilityColumns } from "./columns";
import { ModCompatibilityTable } from "./ModCompatibilityTable";
import { ModCompatibilityResponseDTO } from "@/types/DTO/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";
import { UpdateModCompatibilityDialog } from "./UpdateModCompatibilityDialog";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalPages?: number;
}

export default function ModCompatibilitiesPage() {
  const [modCompatibilityData, setModCompatibilityData] = useState<ModCompatibilityResponseDTO[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<ModCompatibilityResponseDTO | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchModCompatibilities = async () => {
    try {
      setLoading(true);

      const res = await apiCall(
        `/api/admin/mod-compatibilities?page=${pagination.pageIndex + 1}&pageSize=${pagination.pageSize}&q=${debouncedSearchQuery}`
      );
      if (!res.ok) throw new Error(`Failed to fetch mod compatibilities: ${res.status}`);

      const data = await res.json();
      setModCompatibilityData(data.data);
      setTotalPages(data.meta.totalPages);
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

  // Reset to first page when search query changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    fetchModCompatibilities();
  }, [isInitialized, pagination]);

  const handleModCompatibilityDelete = async (ids: string[]) => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/mod-compatibilities", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) throw new Error(`Failed to delete mod compatibilities: ${res.status}`);

      const result = await res.json();
      toast(`Successfully deleted ${result.data.deletedCount} mod compatibility/compatibilities!`);
      await fetchModCompatibilities();
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

  const handleModCompatibilityEdit = async (id: string) => {
    const data = modCompatibilityData.find((modCompatibility) => modCompatibility.id === id);
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
        <ModCompatibilityTable
          columns={modCompatibilityColumns(
            handleModCompatibilityDelete,
            handleModCompatibilityEdit
          )}
          data={modCompatibilityData}
          fetchModCompatibilities={fetchModCompatibilities}
          pagination={{ ...pagination, totalPages }}
          setPagination={setPagination}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
      </div>
      <UpdateModCompatibilityDialog
        fetchData={fetchModCompatibilities}
        open={openEditDialog}
        data={editData}
        setOpen={setOpenEditDialog}
      />
    </section>
  );
}
