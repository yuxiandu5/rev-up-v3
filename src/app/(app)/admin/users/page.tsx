"use client";

import { UserTable } from "./UserTable";
import { AdminUserListItemDTO } from "@/types/AdminDashboardDTO";
import { userColumns } from "./columns";
import { useApiClient } from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export default function UsersPage() {
  const [userData, setUserData] = useState<AdminUserListItemDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { isInitialized } = useAuthStore();
  const { apiCall } = useApiClient();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/users");
      if (res.status === 403) throw new Error("You are no permission.");
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);

      const json = await res.json();
      setUserData(json.data);
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

    fetchUsers();
  }, [isInitialized]);

  const handleUserDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);

      await fetchUsers();
      toast("User deleted!");
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

  const handleToggleActive = async (id: string, status: boolean) => {
    try {
      setLoading(true);

      const statusBody = {
        isActive: !status,
      };
      const res = await apiCall(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(statusBody),
      });

      if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);

      await fetchUsers();
      toast("User status updated!");
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
        <UserTable columns={userColumns(handleToggleActive, handleUserDelete)} data={userData} />
      </div>
    </section>
  );
}
