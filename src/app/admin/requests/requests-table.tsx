"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

import { RequestRolePicker } from "@/app/admin/requests/request-role-picker";
import {
  MOCK_REQUESTS,
  REQUEST_DATE_OPTIONS,
  REQUEST_STATUS_OPTIONS,
  type AccessRequest,
} from "@/app/admin/requests/types";
import { DataTableView } from "@/components/shared/data-table-view";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useListController } from "@/hooks/use-list-controller";
import { formatDate, matchesDateRange } from "@/lib/date";
import type { UserRole } from "@/types/user";

export function RequestsTable() {
  const [assignments, setAssignments] = React.useState<
    Record<string, UserRole>
  >({});

  const controller = useListController<AccessRequest>({
    data: MOCK_REQUESTS,
    searchFields: (item) => `${item.name} ${item.email} ${item.id} ${item.department}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: REQUEST_STATUS_OPTIONS,
      },
      {
        id: "date",
        field: "requestedAt",
        label: "Requested date",
        options: REQUEST_DATE_OPTIONS,
        match: (item, value) => matchesDateRange(item.requestedAt, value),
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
      key: "request",
      header: "Request",
      cell: (row: AccessRequest) => (
        <div className="min-w-[220px]">
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Assign role",
      cell: (row: AccessRequest) => (
        <RequestRolePicker
          value={assignments[row.id] ?? row.requestedRole}
          onChange={(role) =>
            setAssignments((current) => ({ ...current, [row.id]: role }))
          }
        />
      ),
    },
    {
      key: "department",
      header: "Department",
      cell: (row: AccessRequest) => (
        <span className="text-sm text-muted-foreground">
          {row.department}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: AccessRequest) => <StatusBadge status={row.status} />,
    },
    {
      key: "requestedAt",
      header: "Requested on",
      cell: (row: AccessRequest) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.requestedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row: AccessRequest) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => window.alert(`Approved ${row.id}`)}
          >
            <Check />
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => window.alert(`Rejected ${row.id}`)}
          >
            <X />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTableView<AccessRequest>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search requests..."
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
      emptyTitle="No access requests"
      emptyDescription="There are no requests matching your search or filters right now."
    />
  );
}
