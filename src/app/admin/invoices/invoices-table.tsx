"use client";

import * as React from "react";
import { IndianRupee, MoreHorizontal } from "lucide-react";

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

interface Invoice {
  id: string;
  student: string;
  guardian: string;
  term: string;
  amount: number;
  paid: number;
  status: string;
  dueDate: string;
}

const INVOICE_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
  { label: "Partial", value: "partial" },
];

const INVOICE_DATE_OPTIONS = [
  { label: "All dates", value: "all" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "quarter" },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-9001",
    student: "Aditi Sharma",
    guardian: "Rakesh Sharma",
    term: "Term 1",
    amount: 48000,
    paid: 48000,
    status: "paid",
    dueDate: daysAgo(2),
  },
  {
    id: "INV-9002",
    student: "Ayaan Khan",
    guardian: "Imran Khan",
    term: "Term 1",
    amount: 52000,
    paid: 0,
    status: "overdue",
    dueDate: daysAgo(6),
  },
  {
    id: "INV-9003",
    student: "Diya Menon",
    guardian: "Bala Menon",
    term: "Term 2",
    amount: 47500,
    paid: 20000,
    status: "partial",
    dueDate: daysAgo(9),
  },
  {
    id: "INV-9004",
    student: "Kabir Malhotra",
    guardian: "Neha Malhotra",
    term: "Term 2",
    amount: 45000,
    paid: 0,
    status: "pending",
    dueDate: daysAgo(13),
  },
  {
    id: "INV-9005",
    student: "Myra Fernandes",
    guardian: "Elsa Fernandes",
    term: "Term 1",
    amount: 51000,
    paid: 51000,
    status: "paid",
    dueDate: daysAgo(17),
  },
  {
    id: "INV-9006",
    student: "Yash Patel",
    guardian: "Ravi Patel",
    term: "Term 2",
    amount: 44000,
    paid: 15000,
    status: "partial",
    dueDate: daysAgo(21),
  },
  {
    id: "INV-9007",
    student: "Tara Pillai",
    guardian: "Lakshmi Pillai",
    term: "Term 1",
    amount: 56000,
    paid: 0,
    status: "pending",
    dueDate: daysAgo(26),
  },
  {
    id: "INV-9008",
    student: "Ishita Bhardwaj",
    guardian: "Sunil Bhardwaj",
    term: "Term 3",
    amount: 49500,
    paid: 49500,
    status: "paid",
    dueDate: daysAgo(30),
  },
  {
    id: "INV-9009",
    student: "Devansh Gupta",
    guardian: "Anjali Gupta",
    term: "Term 2",
    amount: 46500,
    paid: 0,
    status: "overdue",
    dueDate: daysAgo(36),
  },
  {
    id: "INV-9010",
    student: "Rohan Verma",
    guardian: "Sakshi Verma",
    term: "Term 1",
    amount: 47000,
    paid: 47000,
    status: "paid",
    dueDate: daysAgo(41),
  },
  {
    id: "INV-9011",
    student: "Karthik Subramanian",
    guardian: "Ravi Subramanian",
    term: "Term 3",
    amount: 48500,
    paid: 25000,
    status: "partial",
    dueDate: daysAgo(47),
  },
  {
    id: "INV-9012",
    student: "Zoya Khan",
    guardian: "Farhan Khan",
    term: "Term 2",
    amount: 43000,
    paid: 0,
    status: "pending",
    dueDate: daysAgo(54),
  },
  {
    id: "INV-9013",
    student: "Sneha Reddy",
    guardian: "Mohan Reddy",
    term: "Term 1",
    amount: 45500,
    paid: 45500,
    status: "paid",
    dueDate: daysAgo(60),
  },
  {
    id: "INV-9014",
    student: "Aditya Rao",
    guardian: "Kavya Rao",
    term: "Term 3",
    amount: 53000,
    paid: 10000,
    status: "partial",
    dueDate: daysAgo(68),
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function InvoicesTable() {
  const controller = useListController<Invoice>({
    data: MOCK_INVOICES,
    searchFields: (item) => `${item.id} ${item.student} ${item.guardian} ${item.term}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: INVOICE_STATUS_OPTIONS,
      },
      {
        id: "dueDate",
        field: "dueDate",
        label: "Due date",
        options: INVOICE_DATE_OPTIONS,
        match: (item, value) => matchesDateRange(item.dueDate, value),
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
      key: "invoice",
      header: "Invoice",
      cell: (row: Invoice) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-foreground">{row.id}</p>
          <p className="text-xs text-muted-foreground">{row.term}</p>
        </div>
      ),
    },
    {
      key: "student",
      header: "Student",
      cell: (row: Invoice) => (
        <div className="min-w-[170px]">
          <p className="text-sm text-foreground">{row.student}</p>
          <p className="text-xs text-muted-foreground">
            Guardian: {row.guardian}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row: Invoice) => (
        <span className="flex items-center gap-1 whitespace-nowrap text-sm tabular-nums text-foreground">
          <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "paid",
      header: "Paid",
      cell: (row: Invoice) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
          {formatCurrency(row.paid)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Invoice) => <StatusBadge status={row.status} />,
    },
    {
      key: "dueDate",
      header: "Due",
      cell: (row: Invoice) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.dueDate)}
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
            <DropdownMenuItem>View invoice</DropdownMenuItem>
            <DropdownMenuItem>Record payment</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<Invoice>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search invoices..."
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
      emptyTitle="No invoices found"
      emptyDescription="No invoice matches the current search or filters."
    />
  );
}
