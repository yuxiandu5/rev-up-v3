"use client";

import { useEffect, useState } from "react";
import { mediaAssetColumns } from "./columns";
import { MediaAssetTable } from "./MediaAssetTable";
import { MediaAssetResponseDTO } from "@/types/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";
import { UpdateMediaAssetDialog } from "./UpdateMediaAssetDialog";

export default function MediaAssetsPage() {
  const [mediaAssetData, setMediaAssetData] = useState<MediaAssetResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<(MediaAssetResponseDTO & { modId?: string; modelYearRangeId?: string }) | null>(null);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchMediaAssets = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/media-assets");
      if (!res.ok) throw new Error(`Failed to fetch media assets: ${res.status}`);

      const data = await res.json();
      setMediaAssetData(data.data);
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

    fetchMediaAssets();
  }, [isInitialized]);

  const handleMediaAssetDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/media-assets/${id}`, {
        method: "DELETE",
      });
      if (res.status === 409)
        return toast("You cannot delete a media asset while it is still in use.");
      if (!res.ok) throw new Error(`Failed to delete media asset: ${res.status}`);

      toast("Media asset deleted!");
      await fetchMediaAssets();
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

  const handleMediaAssetEdit = async (id: string) => {
    const data = mediaAssetData.find((mediaAsset) => mediaAsset.id === id);
    if (!data) return;
    
    // Note: The current MediaAssetResponseDTO doesn't include modId/modelYearRangeId
    // You might need to fetch the full details or update the DTO to include these fields
    setEditData(data as MediaAssetResponseDTO & { modId?: string; modelYearRangeId?: string });
    setOpenEditDialog(true);
  };

  if (loading) {
    return <Loading variant="spinner" />;
  }

  return (
    <section className="w-full h-full flex justify-center items-center">
      <div className="w-[95%] h-full">
        <MediaAssetTable
          columns={mediaAssetColumns(handleMediaAssetDelete, handleMediaAssetEdit)}
          data={mediaAssetData}
          fetchMediaAssets={fetchMediaAssets}
        />
      </div>
      <UpdateMediaAssetDialog
        fetchData={fetchMediaAssets}
        open={openEditDialog}
        data={editData}
        setOpen={setOpenEditDialog}
      />
    </section>
  );
}
