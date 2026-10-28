"use client";

import * as React from "react";
import { Bug } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar, type FilterOption } from "@/components/shared/list-toolbar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableViewProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    id: string;
    label: string;
    placeholder?: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  onClear: () => void;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  simulateError: boolean;
  onToggleSimulateError: (value: boolean) => void;
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  visiblePages: number[];
  onPageChange: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbarExtra?: React.ReactNode;
  className?: string;
}

export function DataTableView<T>({
  columns,
  rows,
  getRowKey,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters = [],
  onClear,
  loading,
  error,
  onRetry,
  simulateError,
  onToggleSimulateError,
  page,
  pageCount,
  totalItems,
  pageSize,
  visiblePages,
  onPageChange,
  emptyTitle,
  emptyDescription,
  toolbarExtra,
  className,
}: DataTableViewProps<T>) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <ListToolbar
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        filters={filters}
        onClear={onClear}
      >
        {toolbarExtra}
        <Button
          type="button"
          variant={simulateError ? "destructive" : "outline"}
          size="sm"
          onClick={() => onToggleSimulateError(!simulateError)}
          title="Dev toggle: simulate a failed request"
        >
          <Bug />
          Simulate error
        </Button>
      </ListToolbar>

      {loading ? (
        <LoadingSkeleton rows={8} columns={columns.length} />
      ) : error ? (
        <ErrorState onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={getRowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && !error ? (
        <Pagination
          page={page}
          pageCount={pageCount}
          totalItems={totalItems}
          pageSize={pageSize}
          visiblePages={visiblePages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
