"use client";

import { Button } from "@/components/ui/button";
import { ModelResponseDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

export const modelColumns = (onDelete: (id: string) => void): ColumnDef<ModelResponseDTO>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <span className="block w-25">{row.original.id}</span>;
    },
  },
  {
    accessorKey: "make",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Make
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => (
      <div className="w-15">
        {row.original.make}
      </div>
    )
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    header: "Badges",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.badges?.map((name: string) => (
          <Badge key={name} variant="secondary">
            {name}
          </Badge>
        ))}
      </div>
    )
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
