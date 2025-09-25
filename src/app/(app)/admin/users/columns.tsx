"use client";

import { Button } from "@/components/ui/button";
import { AdminUserListItemDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const userColumns = (
  onToggle: (id: string, status: boolean) => void,
  onDelete: (id: string) => void
): ColumnDef<AdminUserListItemDTO>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm truncate max-w-20" title={row.original.id}>
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UserName
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-32 truncate font-medium" title={row.original.userName}>
        {row.original.userName}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          isActive
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Button
          size="sm"
          variant={`${user.isActive ? "outline" : "destructive"}`}
          onClick={() => onToggle(user.id, user.isActive)}
          className="px-3"
        >
          {user.isActive ? "Active" : "Inactive"}
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="max-w-24 truncate text-center font-medium" title={row.getValue("role") as string}>
        {row.getValue("role")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="max-w-32 truncate text-sm font-mono" title={row.original.createdAt}>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <div className="max-w-32 truncate text-sm font-mono" title={row.original.updatedAt}>
        {new Date(row.original.updatedAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Login",
    cell: ({ row }) => {
      const lastLogin = row.getValue("lastLoginAt") as string;
      return (
        <div className="max-w-32 truncate text-sm font-mono" title={lastLogin}>
          {lastLogin ? new Date(lastLogin).toLocaleDateString() : "Never"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-2 min-w-fit">
          <Button size="sm" variant="destructive" onClick={() => onDelete(user.id)} className="px-3">
            Delete
          </Button>
        </div>
      );
    },
  },
];
