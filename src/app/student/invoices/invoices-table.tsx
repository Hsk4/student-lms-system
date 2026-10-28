"use client";

import * as React from "react";
import { Bug } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListController } from "@/hooks/use-list-controller";
import { dateIn, formatDateOnly, formatRs, formatDateTime } from "@/lib/format";

export interface StudentInvoice {
  id: string;
  period: string;
  amount: number;
  dueDate: string;
  status: string;
}

export const MOCK_STUDENT_INVOICES: StudentInvoice[] = [
  { id: "inv-5101", period: "February 2026", amount: 12000, dueDate: dateIn(-32, 17, 0), status: "paid" },
  { id: "inv-5102", period: "March 2026", amount: 12000, dueDate: dateIn(-18, 17, 0), status: "paid" },
  { id: "inv-5103", period: "April 2026", amount: 12500, dueDate: dateIn(-6, 17, 0), status: "partial" },
  { id: "inv-5104", period: "May 2026", amount: 12000, dueDate: dateIn(-1, 17, 0), status: "pending" },
  { id: "inv-5105", period: "June 2026", amount: 11500, dueDate: dateIn(3, 17, 0), status: "pending" },
  { id: "inv-5106", period: "July 2026", amount: 12000, dueDate: dateIn(9, 17, 0), status: "pending" },
  { id: "inv-5107", period: "August 2026", amount: 12000, dueDate: dateIn(15, 17, 0), status: "due" },
  { id: "inv-5108", period: "September 2026", amount: 12500, dueDate: dateIn(-42, 17, 0), status: "overdue" },
  { id: "inv-5109", period: "October 2026", amount: 12000, dueDate: dateIn(21, 17, 0), status: "due" },
  { id: "inv-5110", period: "November 2026", amount: 11500, dueDate: dateIn(27, 17, 0), status: "due" },
  { id: "inv-5111", period: "December 2026", amount: 12000, dueDate: dateIn(33, 17, 0), status: "due" },
  { id: "inv-5112", period: "January 2027", amount: 12000, dueDate: dateIn(38, 17, 0), status: "due" },
];

const INVOICE_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Partial", value: "partial" },
  { label: "Overdue", value: "overdue" },
];

export function InvoicesTable() {
  const controller = useListController<StudentInvoice>({
    data: MOCK_STUDENT_INVOICES,
    searchFields: (invoice) => `${invoice.period} ${invoice.id}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: INVOICE_STATUS_OPTIONS,
      },
    ],
  });

  const filters = controller.filters.map((filter) => ({
    id: filter.id,
    label: filter.label,
    options: filter.options,
    value: controller.filterValues[filter.id] ?? "all",
    onChange: (value: string) => controller.setFilterValue(filter.id, value),
  }));

  const empty =
    controller.isLoading || controller.isError
      ? null
      : controller.rows.length === 0
        ? controller.hasActiveFilters ? (
            <EmptyState title="No invoices match" description="No invoice matches the current search or filters." />
          ) : (
            <EmptyState
              title="No invoices yet"
              description="Fee invoices issued by the school will appear here."
            />
          )
        : null;

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar
        searchPlaceholder="Search invoices..."
        searchValue={controller.search}
        onSearchChange={controller.setSearch}
        filters={filters}
        onClear={controller.clearFilters}
      >
        <Button
          type="button"
          variant={controller.simulateError ? "destructive" : "outline"}
          size="sm"
          onClick={() =>
            controller.setSimulateError(!controller.simulateError)
          }
          title="Dev toggle: simulate a failed request"
        >
          <Bug />
          Simulate error
        </Button>
      </ListToolbar>

      {controller.isLoading ? (
        <LoadingSkeleton rows={6} columns={4} />
      ) : controller.isError ? (
        <ErrorState onRetry={controller.retry} />
      ) : empty ? (
        empty
      ) : (
        <React.Fragment>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controller.rows.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="min-w-[160px]">
                        <p className="font-medium text-foreground">
                          {invoice.period}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.id.toUpperCase()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
                        {formatRs(invoice.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDateTime(invoice.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:hidden">
            {controller.rows.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {invoice.period}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.id.toUpperCase()}
                    </p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm tabular-nums text-foreground">
                    {formatRs(invoice.amount)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Due {formatDateOnly(invoice.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={controller.page}
            pageCount={controller.pageCount}
            totalItems={controller.totalItems}
            pageSize={controller.pageSize}
            visiblePages={controller.visiblePages}
            onPageChange={controller.setPage}
          />
        </React.Fragment>
      )}
    </div>
  );
}
