"use client";

import { Button } from "@/components/ui/button";
import { MakeItemListDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";

export const makeColumns = (onDelete: (id: string) => void): ColumnDef<MakeItemListDTO>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <span className="block w-25">{row.original.id}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Make",
  },
  {
    accessorKey: "slug",
    header: "Slug",
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
