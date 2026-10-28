"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { DataTableView } from "@/components/shared/data-table-view";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useListController } from "@/hooks/use-list-controller";
import { daysAgo, formatDate, matchesDateRange } from "@/lib/date";

interface Ticket {
  id: string;
  subject: string;
  raisedBy: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

const TICKET_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const TICKET_PRIORITY_OPTIONS = [
  { label: "All priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const TICKET_CATEGORY_OPTIONS = [
  { label: "All categories", value: "all" },
  { label: "Academics", value: "Academics" },
  { label: "Fees", value: "Fees" },
  { label: "Transport", value: "Transport" },
  { label: "Hostel", value: "Hostel" },
  { label: "IT Support", value: "IT Support" },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT-7001",
    subject: "Bus route 12 not picking up my ward",
    raisedBy: "Sneha Reddy",
    category: "Transport",
    priority: "high",
    status: "open",
    createdAt: daysAgo(1),
  },
  {
    id: "TKT-7002",
    subject: "Fee payment receipt not generated",
    raisedBy: "Ayaan Khan",
    category: "Fees",
    priority: "medium",
    status: "in_progress",
    createdAt: daysAgo(3),
  },
  {
    id: "TKT-7003",
    subject: "Grade 8 syllabus mismatch with board",
    raisedBy: "Devansh Gupta",
    category: "Academics",
    priority: "high",
    status: "open",
    createdAt: daysAgo(5),
  },
  {
    id: "TKT-7004",
    subject: "Hostel room AC not working",
    raisedBy: "Tara Pillai",
    category: "Hostel",
    priority: "medium",
    status: "in_progress",
    createdAt: daysAgo(8),
  },
  {
    id: "TKT-7005",
    subject: "Unable to log in to the parent portal",
    raisedBy: "Manish Agarwal",
    category: "IT Support",
    priority: "low",
    status: "resolved",
    createdAt: daysAgo(11),
  },
  {
    id: "TKT-7006",
    subject: "Duplicate fee receipt issued for Term 1",
    raisedBy: "Diya Menon",
    category: "Fees",
    priority: "high",
    status: "resolved",
    createdAt: daysAgo(14),
  },
  {
    id: "TKT-7007",
    subject: "Transfer certificate not processed",
    raisedBy: "Rohan Verma",
    category: "Academics",
    priority: "medium",
    status: "closed",
    createdAt: daysAgo(18),
  },
  {
    id: "TKT-7008",
    subject: "Library fine charged in error",
    raisedBy: "Kabir Malhotra",
    category: "Academics",
    priority: "low",
    status: "closed",
    createdAt: daysAgo(22),
  },
  {
    id: "TKT-7009",
    subject: "Bus pass renewal pending",
    raisedBy: "Ishita Bhardwaj",
    category: "Transport",
    priority: "low",
    status: "open",
    createdAt: daysAgo(26),
  },
  {
    id: "TKT-7010",
    subject: "Wi-Fi not working in the computer lab",
    raisedBy: "Yash Patel",
    category: "IT Support",
    priority: "medium",
    status: "in_progress",
    createdAt: daysAgo(31),
  },
  {
    id: "TKT-7011",
    subject: "Hostel mess bill clarification",
    raisedBy: "Karthik Subramanian",
    category: "Hostel",
    priority: "low",
    status: "closed",
    createdAt: daysAgo(36),
  },
  {
    id: "TKT-7012",
    subject: "Admission form correction needed",
    raisedBy: "Suresh Menon",
    category: "Academics",
    priority: "high",
    status: "open",
    createdAt: daysAgo(42),
  },
  {
    id: "TKT-7013",
    subject: "Fee concession for sibling not applied",
    raisedBy: "Lakshmi Rao",
    category: "Fees",
    priority: "medium",
    status: "resolved",
    createdAt: daysAgo(50),
  },
  {
    id: "TKT-7014",
    subject: "School app crashing on Android 14",
    raisedBy: "Farhan Qureshi",
    category: "IT Support",
    priority: "medium",
    status: "closed",
    createdAt: daysAgo(58),
  },
];

export function TicketsTable() {
  const controller = useListController<Ticket>({
    data: MOCK_TICKETS,
    searchFields: (item) => `${item.subject} ${item.id} ${item.raisedBy} ${item.category}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: TICKET_STATUS_OPTIONS,
      },
      {
        id: "priority",
        field: "priority",
        label: "Priority",
        options: TICKET_PRIORITY_OPTIONS,
      },
      {
        id: "category",
        field: "category",
        label: "Category",
        options: TICKET_CATEGORY_OPTIONS,
      },
      {
        id: "createdAt",
        field: "createdAt",
        label: "Raised on",
        options: [
          { label: "All dates", value: "all" },
          { label: "Last 7 days", value: "7d" },
          { label: "Last 30 days", value: "30d" },
          { label: "Last 90 days", value: "quarter" },
        ],
        match: (item, value) => matchesDateRange(item.createdAt, value),
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

  const columns = [
    {
      key: "ticket",
      header: "Ticket",
      cell: (row: Ticket) => (
        <div className="min-w-[240px]">
          <p className="font-medium text-foreground">{row.subject}</p>
          <p className="text-xs text-muted-foreground">
            {row.id} &middot; Raised by {row.raisedBy}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (row: Ticket) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {row.category}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (row: Ticket) => (
        <StatusBadge
          status={
            row.priority === "high"
              ? "destructive"
              : row.priority === "medium"
                ? "warning"
                : "secondary"
          }
          label={row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Ticket) => (
        <StatusBadge
          status={row.status}
          label={
            row.status === "in_progress"
              ? "In progress"
              : row.status.charAt(0).toUpperCase() + row.status.slice(1)
          }
        />
      ),
    },
    {
      key: "createdAt",
      header: "Raised on",
      cell: (row: Ticket) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Row actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Open ticket</DropdownMenuItem>
            <DropdownMenuItem>Assign to staff</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<Ticket>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search tickets..."
      searchValue={controller.search}
      onSearchChange={controller.setSearch}
      filters={filters}
      onClear={controller.clearFilters}
      loading={controller.isLoading}
      error={controller.isError}
      onRetry={controller.retry}
      simulateError={controller.simulateError}
      onToggleSimulateError={controller.setSimulateError}
      page={controller.page}
      pageCount={controller.pageCount}
      totalItems={controller.totalItems}
      pageSize={controller.pageSize}
      visiblePages={controller.visiblePages}
      onPageChange={controller.setPage}
      emptyTitle="No tickets found"
      emptyDescription="No support ticket matches the current search or filters."
    />
  );
}
