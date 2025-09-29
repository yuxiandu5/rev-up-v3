"use client";

import { Button } from "@/components/ui/button";
import { YearRangeResponseDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { UpdateYearRangeInput } from "@/lib/validations";

interface yearRangeColumnsProps {
  onDelete: (id: string) => void;
  onEdit: (data: UpdateYearRangeInput, id: string) => void;
}

export const yearRangeColumns = ({
  onDelete,
  onEdit,
}: yearRangeColumnsProps): ColumnDef<YearRangeResponseDTO>[] => [
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
    cell: ({ row }) => (
      <div className="max-w-24 truncate" title={row.original.make}>
        {row.original.make}
      </div>
    ),
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
    cell: ({ row }) => (
      <div className="max-w-32 truncate" title={row.original.model}>
        {row.original.model}
      </div>
    ),
  },
  {
    accessorKey: "badge",
    header: "Badge",
    cell: ({ row }) => (
      <div className="max-w-28 truncate" title={row.original.badge}>
        {row.original.badge}
      </div>
    ),
  },
  {
    accessorKey: "year-range",
    header: "YearRange",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.startYear}-{row.original.endYear ?? "present"}
        </div>
      );
    },
  },
  {
    accessorKey: "chassis",
    header: "Chassis",
    cell: ({ row }) => (
      <div className="max-w-20 truncate font-mono text-sm" title={row.original.chassis}>
        {row.original.chassis}
      </div>
    ),
  },
  {
    header: "Specs",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="text-xs space-y-1 max-w-32">
          <div className="flex gap-2">
            <span className="font-medium">HP:</span> {data.hp}
          </div>
          <div className="flex gap-2">
            <span className="font-medium">TQ:</span> {data.torque}
          </div>
          <div className="flex gap-2">
            <span className="font-medium">0-100:</span> {(data.zeroToHundred * 0.1).toFixed(1)}s
          </div>
          <div className="flex gap-2">
            <span className="font-medium">HDL:</span> {data.handling}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "mediaAsset",
    header: "Image URL",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="max-w-32 truncate cursor-help font-mono text-xs"
            title={row.original.mediaAsset}
          >
            {row.original.mediaAsset}
          </div>
        </TooltipTrigger>
        <TooltipContent>{row.original.mediaAsset}</TooltipContent>
      </Tooltip>
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
            variant="outline"
            onClick={() =>
              onEdit(
                {
                  startYear: data.startYear,
                  hp: data.hp,
                  torque: data.torque,
                  zeroToHundred: data.zeroToHundred,
                  handling: data.handling,
                  imageUrl: data.mediaAsset,
                  imageDescription: "",
                  chassis: data.chassis,
                  endYear: data.endYear,
                  imageName: data.imageName ?? "",
                },
                data.id
              )
            }
            className="px-3"
          >
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
