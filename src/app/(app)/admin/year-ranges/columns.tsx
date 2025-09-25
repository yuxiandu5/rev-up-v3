"use client";

import { Button } from "@/components/ui/button";
import { YearRangeResponseDTO } from "@/types/AdminDashboardDTO";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { CreateYearRangeInput } from "@/lib/validations";

interface yearRangeColumnsProps {
  onDelete: (id: string) => void;
  onEdit: (data: CreateYearRangeInput, id: string) => void;
}

export const yearRangeColumns = ({
  onDelete,
  onEdit,
}: yearRangeColumnsProps): ColumnDef<YearRangeResponseDTO>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <span className="block">{row.original.id}</span>;
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
    cell: ({ row }) => {
      return <div className="ml-6">{row.original.make}</div>;
    },
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
    accessorKey: "badge",
    header: "Badge",
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
  },
  {
    header: "Specs",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <ul className="text-sm space-y-1">
          <li>HP: {data.hp}</li>
          <li>Torque: {data.torque} Nm</li>
          <li>0–100: {(data.zeroToHundred * 0.1).toFixed(1)}s</li>
          <li>Handling: {data.handling}</li>
        </ul>
      );
    },
  },
  {
    accessorKey: "mediaAsset",
    header: "Image URL",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block max-w-[200px] truncate cursor-help">
            {row.original.mediaAsset}
          </span>
        </TooltipTrigger>
        <TooltipContent>{row.original.mediaAsset}</TooltipContent>
      </Tooltip>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onDelete(data.id)}
            className="w-18 mr-4"
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-18 mr-4"
            onClick={() =>
              onEdit(
                {
                  badgeId: data.id,
                  startYear: data.startYear,
                  hp: data.hp,
                  torque: data.torque,
                  zeroToHundred: data.zeroToHundred,
                  handling: data.handling,
                  imageUrl: data.mediaAsset,
                  imageDescription: "",
                  chassis: data.chassis,
                  endYear: data.endYear,
                },
                data.id
              )
            }
          >
            Edit
          </Button>
        </>
      );
    },
  },
];
