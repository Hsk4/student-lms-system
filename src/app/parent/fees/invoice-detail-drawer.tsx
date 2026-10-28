"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";

import type { Invoice } from "@/app/parent/mock/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDateOnly, formatRs } from "@/lib/format";

interface InvoiceDetailDrawerProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailDrawer({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="inset-y-0 flex h-full w-full flex-col p-0 sm:max-w-md sm:w-[440px]"
      >
        {invoice ? (
          <>
            <SheetHeader className="border-b border-border bg-card px-5 py-4">
              <SheetTitle className="text-base text-foreground">
                Invoice {invoice.number}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {invoice.childName} · {invoice.period}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "success"
                        : invoice.status === "overdue"
                          ? "destructive"
                          : "warning"
                    }
                    className="mt-1 capitalize"
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-xl font-semibold tracking-tight text-foreground">
                    {formatRs(invoice.amount)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-secondary/60 px-3 py-2">
                  <dt className="text-muted-foreground">Issued</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {formatDateOnly(invoice.issueDate)}
                  </dd>
                </div>
                <div className="rounded-lg bg-secondary/60 px-3 py-2">
                  <dt className="text-muted-foreground">Due</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {formatDateOnly(invoice.dueDate)}
                  </dd>
                </div>
                {invoice.paidOn ? (
                  <div className="col-span-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950/40">
                    <dt className="text-emerald-700 dark:text-emerald-300">Paid on</dt>
                    <dd className="mt-0.5 font-medium text-emerald-800 dark:text-emerald-200">
                      {formatDateOnly(invoice.paidOn)}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Line items
              </h4>
              <ul className="mt-2 space-y-2">
                {invoice.lineItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-foreground">{item.label}</span>
                    <span className="shrink-0 font-medium tabular-nums text-foreground">
                      {formatRs(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>

              <Separator className="my-4" />

              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-foreground">Total</span>
                <span className="tabular-nums text-primary">{formatRs(invoice.amount)}</span>
              </div>
            </div>

            <div className="border-t border-border bg-card px-5 py-4 sm:flex-row">
              <Button type="button" variant="outline" className="w-full">
                <Printer />
                Print
              </Button>
              <Button type="button" variant="outline" className="mt-2 w-full sm:mt-0 sm:ml-2">
                <Download />
                Download
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
