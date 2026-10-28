"use client";

import * as React from "react";
import { Mail, MoreHorizontal, Phone } from "lucide-react";

import { DataTableView } from "@/components/shared/data-table-view";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useListController } from "@/hooks/use-list-controller";
import { daysAgo, formatDate, matchesDateRange } from "@/lib/date";
import type { AppUser } from "@/types/user";

const USER_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

const USER_ROLE_OPTIONS = [
  { label: "All roles", value: "all" },
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Parent", value: "parent" },
];

const JOIN_DATE_OPTIONS = [
  { label: "All dates", value: "all" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "quarter" },
];

const MOCK_USERS: AppUser[] = [
  {
    id: "USR-2001",
    name: "Aditi Sharma",
    email: "aditi.sharma@student.school.edu",
    role: "student",
    status: "active",
    className: "Grade 10 - A",
    joinedAt: daysAgo(2),
    phone: "+91 98200 11223",
  },
  {
    id: "USR-2002",
    name: "Vikram Iyer",
    email: "vikram.iyer@teacher.school.edu",
    role: "teacher",
    status: "active",
    className: "Mathematics",
    joinedAt: daysAgo(5),
    phone: "+91 98200 11345",
  },
  {
    id: "USR-2003",
    name: "Sneha Reddy",
    email: "sneha.reddy@parent.school.edu",
    role: "parent",
    status: "active",
    className: "Grade 8 - B",
    joinedAt: daysAgo(9),
    phone: "+91 98200 11456",
  },
  {
    id: "USR-2004",
    name: "Kabir Malhotra",
    email: "kabir.m@student.school.edu",
    role: "student",
    status: "pending",
    className: "Grade 9 - C",
    joinedAt: daysAgo(13),
    phone: "+91 98200 11567",
  },
  {
    id: "USR-2005",
    name: "Ritu Desai",
    email: "ritu.desai@teacher.school.edu",
    role: "teacher",
    status: "inactive",
    className: "Sanskrit",
    joinedAt: daysAgo(17),
    phone: "+91 98200 11678",
  },
  {
    id: "USR-2006",
    name: "Ayaan Khan",
    email: "ayaan.khan@student.school.edu",
    role: "student",
    status: "active",
    className: "Grade 11 - A",
    joinedAt: daysAgo(21),
    phone: "+91 98200 11789",
  },
  {
    id: "USR-2007",
    name: "Neha Bhatt",
    email: "neha.bhatt@parent.school.edu",
    role: "parent",
    status: "active",
    className: "Grade 6 - A",
    joinedAt: daysAgo(24),
    phone: "+91 98200 11890",
  },
  {
    id: "USR-2008",
    name: "Rohan Kapoor",
    email: "rohan.kapoor@teacher.school.edu",
    role: "teacher",
    status: "active",
    className: "Physics",
    joinedAt: daysAgo(29),
    phone: "+91 98200 11901",
  },
  {
    id: "USR-2009",
    name: "Diya Menon",
    email: "diya.menon@student.school.edu",
    role: "student",
    status: "active",
    className: "Grade 7 - B",
    joinedAt: daysAgo(33),
    phone: "+91 98200 12012",
  },
  {
    id: "USR-2010",
    name: "Sanjay Bose",
    email: "sanjay.bose@parent.school.edu",
    role: "parent",
    status: "inactive",
    className: "Grade 12 - C",
    joinedAt: daysAgo(41),
    phone: "+91 98200 12123",
  },
  {
    id: "USR-2011",
    name: "Myra Fernandes",
    email: "myra.f@teacher.school.edu",
    role: "teacher",
    status: "active",
    className: "Art & Craft",
    joinedAt: daysAgo(47),
    phone: "+91 98200 12234",
  },
  {
    id: "USR-2012",
    name: "Yash Patel",
    email: "yash.patel@student.school.edu",
    role: "student",
    status: "pending",
    className: "Grade 8 - A",
    joinedAt: daysAgo(55),
    phone: "+91 98200 12345",
  },
  {
    id: "USR-2013",
    name: "Kiran Sethi",
    email: "kiran.sethi@parent.school.edu",
    role: "parent",
    status: "active",
    className: "Grade 4 - C",
    joinedAt: daysAgo(63),
    phone: "+91 98200 12456",
  },
  {
    id: "USR-2014",
    name: "Aditya Rao",
    email: "aditya.rao@teacher.school.edu",
    role: "teacher",
    status: "active",
    className: "Economics",
    joinedAt: daysAgo(72),
    phone: "+91 98200 12567",
  },
];

export function UsersTable() {
  const controller = useListController<AppUser>({
    data: MOCK_USERS,
    searchFields: (item) => `${item.name} ${item.email} ${item.id} ${item.className}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: USER_STATUS_OPTIONS,
      },
      {
        id: "role",
        field: "role",
        label: "Role",
        options: USER_ROLE_OPTIONS,
      },
      {
        id: "joinedAt",
        field: "joinedAt",
        label: "Joined on",
        options: JOIN_DATE_OPTIONS,
        match: (item, value) => matchesDateRange(item.joinedAt, value),
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
      key: "user",
      header: "User",
      cell: (row: AppUser) => (
        <div className="min-w-[220px]">
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            {row.email}
          </p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row: AppUser) => (
        <span className="text-sm capitalize text-foreground">{row.role}</span>
      ),
    },
    {
      key: "class",
      header: "Class / Department",
      cell: (row: AppUser) => (
        <span className="text-sm text-muted-foreground">{row.className}</span>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      cell: (row: AppUser) => (
        <span className="flex items-center gap-1 whitespace-nowrap text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          {row.phone}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: AppUser) => <StatusBadge status={row.status} />,
    },
    {
      key: "joinedAt",
      header: "Joined",
      cell: (row: AppUser) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.joinedAt)}
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
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Deactivate user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<AppUser>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search users..."
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
      emptyTitle="No users found"
      emptyDescription="No user matches the current search or filters."
    />
  );
}
