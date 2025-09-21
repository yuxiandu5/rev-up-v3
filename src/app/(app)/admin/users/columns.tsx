"use client";

import { Button } from "@/components/ui/button";
import { AdminUserListItemDTO } from "@/types/usersDto";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const userColumns = (
  onToggle: (id: string, status: boolean) => void,
  onDelete: (id: string) => void
): ColumnDef<AdminUserListItemDTO>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          userName
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
          variant={`${user.isActive ? "outline" : "destructive"}`}
          onClick={() => onToggle(user.id, user.isActive)}
        >
          {user.isActive ? "Active" : "Inactive"}
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
  },
  {
    accessorKey: "updatedAt",
    header: "updatedAt",
  },
  {
    accessorKey: "lastLoginAt",
    header: "lastLoginAt",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Button size="sm" variant="secondary" onClick={() => onDelete(user.id)}>
          Delete
        </Button>
      );
    },
  },
];
