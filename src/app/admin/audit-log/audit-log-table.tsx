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

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: string;
  ip: string;
  createdAt: string;
}

const AUDIT_SEVERITY_OPTIONS = [
  { label: "All severities", value: "all" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Critical", value: "critical" },
];

const AUDIT_DATE_OPTIONS = [
  { label: "All dates", value: "all" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "quarter" },
];

const MOCK_AUDIT_LOG: AuditEntry[] = [
  {
    id: "AUD-001",
    actor: "Meera Kapoor",
    action: "role.assigned",
    target: "REQ-1042 -> teacher",
    severity: "info",
    ip: "10.14.2.21",
    createdAt: daysAgo(0),
  },
  {
    id: "AUD-002",
    actor: "Aarav Sharma",
    action: "invoice.voided",
    target: "INV-9006",
    severity: "warning",
    ip: "10.14.2.88",
    createdAt: daysAgo(1),
  },
  {
    id: "AUD-003",
    actor: "System",
    action: "password.reset",
    target: "USR-2004",
    severity: "info",
    ip: "127.0.0.1",
    createdAt: daysAgo(2),
  },
  {
    id: "AUD-004",
    actor: "Meera Kapoor",
    action: "admin.created",
    target: "ADM-009",
    severity: "critical",
    ip: "10.14.2.21",
    createdAt: daysAgo(3),
  },
  {
    id: "AUD-005",
    actor: "Aarav Sharma",
    action: "course.updated",
    target: "CRS-309",
    severity: "info",
    ip: "10.14.2.88",
    createdAt: daysAgo(5),
  },
  {
    id: "AUD-006",
    actor: "Unknown",
    action: "login.failed",
    target: "aarav.sharma@school.edu",
    severity: "critical",
    ip: "203.0.113.44",
    createdAt: daysAgo(7),
  },
  {
    id: "AUD-007",
    actor: "Meera Kapoor",
    action: "book.archived",
    target: "BOK-513",
    severity: "warning",
    ip: "10.14.2.21",
    createdAt: daysAgo(9),
  },
  {
    id: "AUD-008",
    actor: "Aarav Sharma",
    action: "user.deactivated",
    target: "USR-2005",
    severity: "warning",
    ip: "10.14.2.88",
    createdAt: daysAgo(12),
  },
  {
    id: "AUD-009",
    actor: "System",
    action: "backup.completed",
    target: "database dump",
    severity: "info",
    ip: "127.0.0.1",
    createdAt: daysAgo(15),
  },
  {
    id: "AUD-010",
    actor: "Meera Kapoor",
    action: "board.deactivated",
    target: "BRD-06",
    severity: "warning",
    ip: "10.14.2.21",
    createdAt: daysAgo(19),
  },
  {
    id: "AUD-011",
    actor: "System",
    action: "permission.denied",
    target: "invoices.write",
    severity: "critical",
    ip: "10.14.9.14",
    createdAt: daysAgo(23),
  },
  {
    id: "AUD-012",
    actor: "Aarav Sharma",
    action: "ticket.resolved",
    target: "TKT-7006",
    severity: "info",
    ip: "10.14.2.88",
    createdAt: daysAgo(28),
  },
  {
    id: "AUD-013",
    actor: "Meera Kapoor",
    action: "settings.updated",
    target: "fee.concession",
    severity: "warning",
    ip: "10.14.2.21",
    createdAt: daysAgo(33),
  },
  {
    id: "AUD-014",
    actor: "System",
    action: "session.expired",
    target: "USR-2011",
    severity: "info",
    ip: "198.51.100.7",
    createdAt: daysAgo(41),
  },
];

export function AuditLogTable() {
  const controller = useListController<AuditEntry>({
    data: MOCK_AUDIT_LOG,
    searchFields: (item) => `${item.actor} ${item.action} ${item.target} ${item.id}`,
    filters: [
      {
        id: "severity",
        field: "severity",
        label: "Severity",
        options: AUDIT_SEVERITY_OPTIONS,
      },
      {
        id: "createdAt",
        field: "createdAt",
        label: "Date",
        options: AUDIT_DATE_OPTIONS,
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
      key: "event",
      header: "Event",
      cell: (row: AuditEntry) => (
        <div className="min-w-[220px]">
          <p className="font-medium text-foreground">{row.action}</p>
          <p className="text-xs text-muted-foreground">{row.target}</p>
        </div>
      ),
    },
    {
      key: "actor",
      header: "Actor",
      cell: (row: AuditEntry) => (
        <span className="whitespace-nowrap text-sm text-foreground">
          {row.actor}
        </span>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      cell: (row: AuditEntry) => (
        <StatusBadge
          status={
            row.severity === "critical"
              ? "destructive"
              : row.severity === "warning"
                ? "warning"
                : "info"
          }
          label={row.severity.charAt(0).toUpperCase() + row.severity.slice(1)}
        />
      ),
    },
    {
      key: "ip",
      header: "IP address",
      cell: (row: AuditEntry) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
          {row.ip}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Timestamp",
      cell: (row: AuditEntry) => (
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
            <DropdownMenuItem>View diff</DropdownMenuItem>
            <DropdownMenuItem>Copy event id</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export entry</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<AuditEntry>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search audit log..."
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
      emptyTitle="No audit entries"
      emptyDescription="No activity matches the current search or filters."
    />
  );
}
