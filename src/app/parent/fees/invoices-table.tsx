"use client";

import * as React from "react";
import { Eye } from "lucide-react";

import type { Invoice } from "@/app/parent/mock/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateOnly, formatRs } from "@/lib/format";
import { cn } from "@/lib/utils";

export type InvoiceFilter = "all" | "due" | "paid" | "overdue";

interface InvoicesTableProps {
  invoices: Invoice[];
  filter: InvoiceFilter;
  onViewInvoice: (invoice: Invoice) => void;
}

export function InvoicesTable({ invoices, filter, onViewInvoice }: InvoicesTableProps) {
  const visible = invoices.filter(
    (invoice) => filter === "all" || invoice.status === filter,
  );

  if (visible.length === 0) return null;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:hidden">
        <ul className="divide-y divide-border/70">
          {visible.map((invoice) => (
            <li key={invoice.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {invoice.number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.childName} · {invoice.period}
                  </p>
                </div>
                <StatusChip status={invoice.status} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-base font-semibold tracking-tight text-foreground">
                  {formatRs(invoice.amount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Due {formatDateOnly(invoice.dueDate)}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onViewInvoice(invoice)}
                >
                  <Eye />
                  View
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                <TableHead>Invoice</TableHead>
                <TableHead>Child</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-foreground">
                    {invoice.number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.childName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.period}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-foreground">
                    {formatRs(invoice.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateOnly(invoice.dueDate)}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onViewInvoice(invoice)}
                    >
                      <Eye />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

function StatusChip({ status }: { status: Invoice["status"] }) {
  return (
    <Badge
      variant={
        status === "paid" ? "success" : status === "overdue" ? "destructive" : "warning"
      }
      className={cn("capitalize")}
    >
      {status}
    </Badge>
  );
}
