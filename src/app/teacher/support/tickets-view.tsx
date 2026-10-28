"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { formatDateTime } from "@/lib/format";
import { getSupportTickets } from "@/app/teacher/mock/data";
import type { SupportTicket } from "@/app/teacher/mock/types";
import { TicketsList } from "@/app/teacher/support/tickets-table";
import { NewTicketDialog } from "@/app/teacher/support/new-ticket-dialog";

const PAGE_SIZE = 10;

export function TicketsView() {
  const load = useMockPageLoad();
  const [statusTab, setStatusTab] = React.useState<"open" | "resolved">("open");
  const [category, setCategory] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const allTickets = React.useMemo(() => getSupportTickets(), []);

  const categories = React.useMemo(
    () => Array.from(new Set(allTickets.map((ticket) => ticket.category))),
    [allTickets],
  );

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return allTickets.filter((ticket) => {
      const matchesTab = ticket.status === statusTab;
      const matchesCategory = category === "all" || ticket.category === category;
      const matchesSearch =
        term.length === 0 ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.category.toLowerCase().includes(term);
      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [allTickets, statusTab, category, search]);

  React.useEffect(() => {
    setPage(1);
  }, [statusTab, category, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (load.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-16 w-64 animate-pulse rounded-lg bg-secondary" />
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-9 w-28 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
        <LoadingSkeleton rows={5} columns={4} />
      </div>
    );
  }

  if (load.isError) {
    return (
      <ErrorState
        onRetry={load.retry}
        description="We could not load your tickets. Please try again in a moment."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Support</h2>
          <p className="text-sm text-muted-foreground">
            Raise requests with the school team and track their replies.
          </p>
        </div>
        <Button type="button" onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
          New ticket
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={statusTab} onValueChange={(value) => setStatusTab(value as "open" | "resolved")}>
          <TabsList>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger className="h-9 w-[170px]" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((categoryOption) => (
                <SelectItem key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tickets…"
            aria-label="Search tickets"
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground sm:w-44"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={statusTab === "open" ? "No open tickets" : "No resolved tickets"}
          description={
            statusTab === "open"
              ? "Raise a ticket and the school team will respond here."
              : "Resolved tickets move here once the team closes them."
          }
          action={
            <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
              New ticket
            </Button>
          }
        />
      ) : (
        <TicketsList rows={rows} />
      )}

      <Pagination
        page={page}
        pageCount={pageCount}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <div className="flex justify-end">
        <Button
          type="button"
          variant={load.simulateError ? "destructive" : "ghost"}
          size="sm"
          onClick={() => load.setSimulateError(!load.simulateError)}
          title="Dev toggle: simulate a failed request on next load"
        >
          Simulate error
        </Button>
      </div>

      <NewTicketDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
