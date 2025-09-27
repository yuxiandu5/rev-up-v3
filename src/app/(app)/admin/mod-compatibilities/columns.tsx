"use client";

import { Button } from "@/components/ui/button";
import { ModCompatibilityResponseDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

export const modCompatibilityColumns = (
  onDelete: (ids: string[]) => void, 
  onEdit: (id: string) => void
): ColumnDef<ModCompatibilityResponseDTO>[] => [
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
    accessorKey: "mod",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mod
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium max-w-xs truncate" title={row.original.mod}>
        {row.original.mod}
      </div>
    ),
  },
  {
    accessorKey: "carName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Car
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-xs">
          {row.original.carName}
        </div>
      );
    },
  },
  {
    accessorKey: "performance",
    header: "Performance",
    cell: ({ row }) => {
      const { hpGain, nmGain, handlingDelta, zeroToHundredDelta } = row.original;    
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {hpGain && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              +{hpGain}hp
            </Badge>
          )}
          {nmGain && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              +{nmGain}Nm
            </Badge>
          )}
          {handlingDelta && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              H{handlingDelta > 0 ? '+' : ''}{handlingDelta}
            </Badge>
          )}
          {zeroToHundredDelta !== 0 && zeroToHundredDelta !== undefined && ( 
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {zeroToHundredDelta > 0 ? '+' : ''}{(zeroToHundredDelta / 10).toFixed(1)}s
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.price;
      return price ? (
        <div className="font-medium">
          ${price.toLocaleString()}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">N/A</div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-sm" title={row.original.notes || ""}>
        {row.original.notes || "-"}
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
          <Button size="sm" variant="destructive" onClick={() => onDelete([data.id])} className="px-3">
            Delete
          </Button>
        </div>
      );
    },
  },
];
