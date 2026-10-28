"use client";

import * as React from "react";

import { InvoicesTable, type InvoiceFilter } from "@/app/parent/fees/invoices-table";
import { InvoiceDetailDrawer } from "@/app/parent/fees/invoice-detail-drawer";
import { feeTotalsFor, getInvoicesForChild } from "@/app/parent/mock/data";
import type { Invoice } from "@/app/parent/mock/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState } from "@/components/shared/error-state";
import { formatDateOnly, formatRs } from "@/lib/format";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { useCurrentParent } from "@/hooks/use-current-parent";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS: { value: InvoiceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "due", label: "Due" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export function FeesView() {
  const { scopedChildId, selectedChild, isAllChildrenSelected, linkedChildren } =
    useCurrentParent();
  const controller = useMockPageLoad();

  const invoices = React.useMemo(
    () => getInvoicesForChild(scopedChildId),
    [scopedChildId],
  );

  const totals = React.useMemo(() => feeTotalsFor(invoices), [invoices]);

  const [filter, setFilter] = React.useState<InvoiceFilter>("all");
  const [activeInvoice, setActiveInvoice] = React.useState<Invoice | null>(null);

  if (controller.isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-80 rounded-lg" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <ErrorState
        onRetry={controller.retry}
        description="We could not load invoices. Please try again."
      />
    );
  }

  const visibleChildLabel = isAllChildrenSelected
    ? `${linkedChildren.length} children`
    : selectedChild?.name;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Fees</h2>
        <p className="text-sm text-muted-foreground">
          Invoices and due dates for {visibleChildLabel}. Payments are recorded by the school.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Total outstanding" value={formatRs(totals.outstanding)} emphasize />
        <SummaryCard
          label="Next due date"
          value={totals.nextDueDate ? formatDateOnly(totals.nextDueDate) : "—"}
        />
        <SummaryCard label="Paid this term" value={formatRs(totals.paidThisTerm)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as InvoiceFilter)}>
          <TabsList aria-label="Invoice status filter">
            {FILTERS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <InvoicesTable
        invoices={invoices}
        filter={filter}
        onViewInvoice={setActiveInvoice}
      />

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">No invoices yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Invoices appear here once the school issues them.
          </p>
        </div>
      ) : null}

      <InvoiceDetailDrawer
        invoice={activeInvoice}
        open={activeInvoice !== null}
        onOpenChange={(open) => {
          if (!open) setActiveInvoice(null);
        }}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={
          emphasize
            ? "mt-1.5 text-xl font-semibold tracking-tight text-primary"
            : "mt-1.5 text-lg font-semibold tracking-tight text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}
