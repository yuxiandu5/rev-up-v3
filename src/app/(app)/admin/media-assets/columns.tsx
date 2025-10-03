"use client";

import { Button } from "@/components/ui/button";
import { MediaAssetResponseDTO } from "@/types/DTO/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const mediaAssetColumns = (
  onDelete: (id: string) => void,
  onEdit: (id: string) => void
): ColumnDef<MediaAssetResponseDTO>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-xs">
        <div className="truncate" title={row.original.url}>
          {row.original.url}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={() => window.open(row.original.url, "_blank")}
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
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
          <Button size="sm" variant="outline" onClick={() => onEdit(data.id)} className="px-3">
            Edit
          </Button>
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
