"use client";

import { useEffect, useState } from "react";
import { badgeColumns } from "./columns";
import { BadgeTable } from "./BadgeTable";
import { BadgeResponseDTO } from "@/types/AdminDashboardDTO";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";

export default function BadgePage() {
  const [badgeData, setBadgeData] = useState<BadgeResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  const fetchBadges = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/badges");
      if (!res.ok) throw new Error(`Failed to fetch badges: ${res.status}`);

      const data = await res.json();
      setBadgeData(data.data);
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

    fetchBadges();
  }, [isInitialized]);

  const handleBadgeDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/badges/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete badge: ${res.status}`);

      toast("badge deleted!");
      await fetchBadges();
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
        <BadgeTable
          columns={badgeColumns(handleBadgeDelete)}
          data={badgeData}
          fetchBadges={fetchBadges}
        />
      </div>
    </section>
  );
}
