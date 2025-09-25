"use client";

import { useEffect, useState, useContext } from "react";
import { yearRangeColumns } from "./columns";
import { YearRangeTable } from "./YearRangeTable";
import { YearRangeResponseDTO } from "@/types/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";
import { CreateYearRangeInput } from "@/lib/validations";
import { OpenDialogContext } from "./context";

export default function YearRangePage() {
  const [yearRangeData, setYearRangeData] = useState<YearRangeResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dialog = useContext(OpenDialogContext);
  if (!dialog) throw new Error("no!");
  const { setData, setOpenDialog, setIsEdit, setId } = dialog;

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchYearRanges = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/year-ranges");
      if (!res.ok) throw new Error(`Failed to fetch year-ranges: ${res.status}`);

      const data = await res.json();
      setYearRangeData(data.data);
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

    fetchYearRanges();
  }, [isInitialized]);

  const handleYearRangeDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/year-ranges/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Failed to delete yearRange: ${res.status}`);

      toast("yearRange deleted!");
      await fetchYearRanges();
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

  const handleYearRangeEdit = (rowData: CreateYearRangeInput, id: string) => {
    setData(rowData);
    setIsEdit(true);
    setOpenDialog(true);
    setId(id);
  };

  const handleYearRangeCreate = () => {
    setIsEdit(false);
    setOpenDialog(true);
  };

  if (loading) {
    return <Loading variant="spinner" />;
  }

  return (
    <section className="w-full h-full flex justify-center items-center">
      <div className="w-[95%] h-full">
        <YearRangeTable
          columns={yearRangeColumns({
            onDelete: handleYearRangeDelete,
            onEdit: handleYearRangeEdit,
          })}
          data={yearRangeData}
          fetchYearRanges={fetchYearRanges}
          onCreate={handleYearRangeCreate}
        />
      </div>
    </section>
  );
}
