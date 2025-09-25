"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { YearRangeDialog } from "./YearRangeDialog";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { YearRangeResponseDTO } from "@/types/AdminDashboardDTO";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps {
  columns: ColumnDef<YearRangeResponseDTO>[];
  data: YearRangeResponseDTO[];
  fetchYearRanges: () => void;
  onCreate: () => void;
}

export function YearRangeTable({ columns, data, fetchYearRanges, onCreate }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div>
      {/* Search bar */}
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search badge..."
          value={(table.getColumn("badge")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("badge")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Button size="lg" variant="outline" onClick={onCreate}>
          Add YearRange
        </Button>
        <YearRangeDialog onSuccess={fetchYearRanges} />
      </div>

      {/* Main */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Page</span>
          <span className="font-medium text-foreground">{pagination.pageIndex + 1}</span>
          <span>of</span>
          <span className="font-medium text-foreground">{table.getPageCount()}</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: 0,
                pageSize: Number(value),
              }));
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select a page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Size</SelectLabel>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="mr-4"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
