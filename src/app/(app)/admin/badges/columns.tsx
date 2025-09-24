"use client";

import { Button } from "@/components/ui/button";
import { BadgeResponseDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

export const badgeColumns = (onDelete: (id: string) => void): ColumnDef<BadgeResponseDTO>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <span className="block w-26">{row.original.id}</span>;
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
    cell: ({row}) => {
      return(
        <div className="ml-6">
          {row.original.make}
        </div>
      )
    }
  },
  {
    accessorKey: "model",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Badge",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    header: "Badges",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.yearRanges?.map((name: string) => (
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
      const data = row.original;

      return (
        <Button size="sm" variant="secondary" onClick={() => onDelete(data.id)}>
          Delete
        </Button>
      );
    },
  },
];
