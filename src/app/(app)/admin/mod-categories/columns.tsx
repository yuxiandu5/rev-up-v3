"use client";

import { Button } from "@/components/ui/button";
import { ModCategoryResponseDTO } from "@/types/DTO/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

export const modCategoryColumns = (
  onDelete: (id: string) => void,
  onEdit: (id: string) => void
): ColumnDef<ModCategoryResponseDTO>[] => [
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "mods",
    header: "Mods",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {row.original.mods?.slice(0, 3).map((name: string) => (
          <Badge key={name} variant="secondary" className="text-xs px-2 py-1 truncate">
            {name}
          </Badge>
        ))}
        {row.original.mods && row.original.mods.length > 3 && (
          <Badge variant="outline" className="text-xs px-2 py-1">
            +{row.original.mods.length - 3}
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
