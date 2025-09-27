"use client";

import { Button } from "@/components/ui/button";
import { MakeItemListDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";

export const makeColumns = (onDelete: (id: string) => void): ColumnDef<MakeItemListDTO>[] => [
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
    header: "Make",
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
