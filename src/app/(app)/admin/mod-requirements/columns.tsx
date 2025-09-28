"use client";

import { Button } from "@/components/ui/button";
import { ModRequirementResponseDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

export const modRequirementColumns = (
  onDelete: (id: string) => void
): ColumnDef<ModRequirementResponseDTO>[] => [
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
    accessorKey: "dependent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dependent Mod
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-xs truncate font-medium" title={row.original.dependent}>
        {row.original.dependent}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs px-2 py-1">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "prerequisiteCategory",
    header: "Prerequisites",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.prerequisiteCategory?.map((name: string, index: number) => (
          <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
            {name}
          </Badge>
        ))}
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
