"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bug, ChevronRight, LifeBuoy } from "lucide-react";

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
import { matchesDateRange } from "@/lib/date";
import { dateIn, formatDateTime } from "@/lib/format";

export interface TicketMessage {
  id: string;
  authorRole: "student" | "support";
  author: string;
  content: string;
  at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  lastUpdate: string;
  messages: TicketMessage[];
}

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "tkt-401",
    subject: "Physics class moved to a different slot",
    status: "open",
    createdAt: dateIn(-2, 10, 15),
    lastUpdate: dateIn(-2, 10, 15),
    messages: [
      {
        id: "msg-1",
        authorRole: "student",
        author: "Aditi Sharma",
        content:
          "The Tuesday 9 AM Physics class clashes with my school exam period. Can it be moved later in the week?",
        at: dateIn(-2, 10, 15),
      },
    ],
  },
  {
    id: "tkt-402",
    subject: "Uploaded assignment file was rejected",
    status: "in_progress",
    createdAt: dateIn(-6, 18, 40),
    lastUpdate: dateIn(-4, 11, 5),
    messages: [
      {
        id: "msg-1",
        authorRole: "student",
        author: "Aditi Sharma",
        content:
          "My lab report PDF (8 MB) was rejected for being too large. I cannot compress it further on my phone.",
        at: dateIn(-6, 18, 40),
      },
      {
        id: "msg-2",
        authorRole: "support",
        author: "Support team",
        content:
          "Thanks! We have raised the limit for your account. Please try uploading the original file again.",
        at: dateIn(-4, 11, 5),
      },
    ],
  },
  {
    id: "tkt-403",
    subject: "Wrong fee shown for April",
    status: "resolved",
    createdAt: dateIn(-20, 9, 30),
    lastUpdate: dateIn(-16, 15, 20),
    messages: [
      {
        id: "msg-1",
        authorRole: "student",
        author: "Aditi Sharma",
        content: "The April invoice shows a lab fee I do not think applies to me.",
        at: dateIn(-20, 9, 30),
      },
      {
        id: "msg-2",
        authorRole: "support",
        author: "Support team",
        content:
          "You are right — the lab fee applies from June. We have corrected the invoice and shared the updated copy.",
        at: dateIn(-16, 15, 20),
      },
    ],
  },
  {
    id: "tkt-404",
    subject: "Request parent access for my guardian",
    status: "closed",
    createdAt: dateIn(-34, 12, 0),
    lastUpdate: dateIn(-30, 9, 0),
    messages: [
      {
        id: "msg-1",
        authorRole: "student",
        author: "Aditi Sharma",
        content: "How can my mother see my attendance and fees?",
        at: dateIn(-34, 12, 0),
      },
      {
        id: "msg-2",
        authorRole: "support",
        author: "Support team",
        content:
          "Use the Add a parent screen to send an invitation; she will get her own login details.",
        at: dateIn(-30, 9, 0),
      },
    ],
  },
];

const TICKET_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const TICKET_DATE_OPTIONS = [
  { label: "Any time", value: "all" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "quarter" },
];

interface TicketsTableProps {
  tickets: SupportTicket[];
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const router = useRouter();
  const controller = useListController<SupportTicket>({
    data: tickets,
    searchFields: (ticket) => ticket.subject,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: TICKET_STATUS_OPTIONS,
      },
      {
        id: "lastUpdate",
        field: "lastUpdate",
        label: "Last update",
        options: TICKET_DATE_OPTIONS,
        match: (ticket, value) => matchesDateRange(ticket.lastUpdate, value),
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
            <EmptyState title="No tickets match" description="No ticket matches the current search or filters." />
          ) : (
            <EmptyState
              title="No tickets yet"
              description="Stuck on something? Open a ticket and the support team will reply here."
              icon={LifeBuoy}
            />
          )
        : null;

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar
        searchPlaceholder="Search tickets..."
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
        <LoadingSkeleton rows={4} columns={4} />
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
                  <TableHead>Subject</TableHead>
                  <TableHead>Last update</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {controller.rows.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/student/support/${ticket.id}`)}
                  >
                    <TableCell>
                      <p className="min-w-[200px] font-medium text-foreground">
                        {ticket.subject}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDateTime(ticket.lastUpdate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {ticket.messages.length}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:hidden">
            {controller.rows.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/student/support/${ticket.id}`}
                className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {ticket.subject}
                  </p>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Last update {formatDateTime(ticket.lastUpdate)} ·{" "}
                  {ticket.messages.length}{" "}
                  {ticket.messages.length === 1 ? "message" : "messages"}
                </p>
              </Link>
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
