"use client";

import * as React from "react";
import { MoreHorizontal, ShieldCheck } from "lucide-react";

import { DataTableView } from "@/components/shared/data-table-view";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { daysAgo, formatDate } from "@/lib/date";
import type { AdminRole } from "@/types/user";

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: string;
  lastActive: string;
  createdOn: string;
}

const ADMIN_ROLE_OPTIONS = [
  { label: "All roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
];

const ADMIN_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const MOCK_ADMINS: AdminAccount[] = [
  {
    id: "ADM-001",
    name: "Meera Kapoor",
    email: "meera.kapoor@school.edu",
    role: "super_admin",
    status: "active",
    lastActive: daysAgo(0),
    createdOn: daysAgo(1200),
  },
  {
    id: "ADM-002",
    name: "Aarav Sharma",
    email: "aarav.sharma@school.edu",
    role: "admin",
    status: "active",
    lastActive: daysAgo(1),
    createdOn: daysAgo(980),
  },
  {
    id: "ADM-003",
    name: "Neha Suri",
    email: "neha.suri@school.edu",
    role: "admin",
    status: "active",
    lastActive: daysAgo(3),
    createdOn: daysAgo(860),
  },
  {
    id: "ADM-004",
    name: "Kunal Trivedi",
    email: "kunal.t@school.edu",
    role: "admin",
    status: "inactive",
    lastActive: daysAgo(38),
    createdOn: daysAgo(740),
  },
  {
    id: "ADM-005",
    name: "Rhea Dsouza",
    email: "rhea.d@school.edu",
    role: "super_admin",
    status: "active",
    lastActive: daysAgo(2),
    createdOn: daysAgo(690),
  },
  {
    id: "ADM-006",
    name: "Vivek Anand",
    email: "vivek.anand@school.edu",
    role: "admin",
    status: "active",
    lastActive: daysAgo(6),
    createdOn: daysAgo(520),
  },
  {
    id: "ADM-007",
    name: "Sana Mirza",
    email: "sana.mirza@school.edu",
    role: "admin",
    status: "active",
    lastActive: daysAgo(9),
    createdOn: daysAgo(430),
  },
  {
    id: "ADM-008",
    name: "Dev Malhotra",
    email: "dev.malhotra@school.edu",
    role: "admin",
    status: "inactive",
    lastActive: daysAgo(72),
    createdOn: daysAgo(380),
  },
  {
    id: "ADM-009",
    name: "Aisha Rahman",
    email: "aisha.rahman@school.edu",
    role: "admin",
    status: "active",
    lastActive: daysAgo(4),
    createdOn: daysAgo(300),
  },
  {
    id: "ADM-010",
    name: "Pranav Sethi",
    email: "pranav.sethi@school.edu",
    role: "admin",
    status: "active",
    lastActive: daysAgo(11),
    createdOn: daysAgo(240),
  },
  {
    id: "ADM-011",
    name: "Nikita Bose",
    email: "nikita.bose@school.edu",
    role: "admin",
    status: "active",
    lastActive: daysAgo(7),
    createdOn: daysAgo(160),
  },
  {
    id: "ADM-012",
    name: "Harsh Vardhan",
    email: "harsh.v@school.edu",
    role: "admin",
    status: "inactive",
    lastActive: daysAgo(96),
    createdOn: daysAgo(120),
  },
];

export function AdminsTable() {
  const controller = useListController<AdminAccount>({
    data: MOCK_ADMINS,
    searchFields: (item) => `${item.name} ${item.email} ${item.id}`,
    filters: [
      {
        id: "role",
        field: "role",
        label: "Role",
        options: ADMIN_ROLE_OPTIONS,
      },
      {
        id: "status",
        field: "status",
        label: "Status",
        options: ADMIN_STATUS_OPTIONS,
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
      key: "admin",
      header: "Administrator",
      cell: (row: AdminAccount) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback>
              {row.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row: AdminAccount) => (
        <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          {row.role === "super_admin" ? "Super Admin" : "Admin"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: AdminAccount) => <StatusBadge status={row.status} />,
    },
    {
      key: "lastActive",
      header: "Last active",
      cell: (row: AdminAccount) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.lastActive)}
        </span>
      ),
    },
    {
      key: "createdOn",
      header: "Added on",
      cell: (row: AdminAccount) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.createdOn)}
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
            <DropdownMenuItem>View permissions</DropdownMenuItem>
            <DropdownMenuItem>Change role</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Revoke access
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<AdminAccount>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search administrators..."
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
      emptyTitle="No administrators found"
      emptyDescription="No administrator matches the current search or filters."
    />
  );
}
