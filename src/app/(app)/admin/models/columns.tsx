"use client";

import { Button } from "@/components/ui/button";
import { ModelResponseDTO } from "@/types/DTO/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

export const modelColumns = (onDelete: (id: string) => void): ColumnDef<ModelResponseDTO>[] => [
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
    cell: ({ row }) => <div title={row.original.make}>{row.original.make}</div>,
  },
  {
    accessorKey: "name",
    header: "Model",
    cell: ({ row }) => (
      <div className="max-w-32 truncate" title={row.original.name}>
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <div className="max-w-28 truncate font-mono text-sm" title={row.original.slug}>
        {row.original.slug}
      </div>
    ),
  },
  {
    header: "Badges",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {row.original.badges?.slice(0, 3).map((name: string) => (
          <Badge key={name} variant="secondary" className="text-xs px-2 py-1 truncate">
            {name}
          </Badge>
        ))}
        {row.original.badges && row.original.badges.length > 3 && (
          <Badge variant="outline" className="text-xs px-2 py-1">
            +{row.original.badges.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex gap-2 min-w-fit">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(data.id)}
            className="px-3"
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
