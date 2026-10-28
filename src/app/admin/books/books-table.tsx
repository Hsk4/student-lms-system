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
import { daysAgo } from "@/lib/date";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  available: number;
  status: string;
  addedOn: string;
}

const BOOK_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Available", value: "available" },
  { label: "Issued", value: "issued" },
  { label: "Archived", value: "archived" },
];

const BOOK_CATEGORY_OPTIONS = [
  { label: "All categories", value: "all" },
  { label: "Textbook", value: "Textbook" },
  { label: "Reference", value: "Reference" },
  { label: "Fiction", value: "Fiction" },
  { label: "Journals", value: "Journals" },
];

const MOCK_BOOKS: Book[] = [
  {
    id: "BOK-501",
    isbn: "978-81-4021-233-4",
    title: "Mathematics for Class 10",
    author: "R. D. Sharma",
    category: "Textbook",
    copies: 60,
    available: 18,
    status: "available",
    addedOn: daysAgo(4),
  },
  {
    id: "BOK-502",
    isbn: "978-81-4021-556-8",
    title: "Physics Part I",
    author: "S. L. Arora",
    category: "Textbook",
    copies: 45,
    available: 6,
    status: "issued",
    addedOn: daysAgo(8),
  },
  {
    id: "BOK-503",
    isbn: "978-0-14-044913-6",
    title: "The Tale of Two Cities",
    author: "Charles Dickens",
    category: "Fiction",
    copies: 30,
    available: 12,
    status: "available",
    addedOn: daysAgo(12),
  },
  {
    id: "BOK-504",
    isbn: "978-93-3251-987-0",
    title: "Oxford Student Atlas",
    author: "Oxford Press",
    category: "Reference",
    copies: 18,
    available: 4,
    status: "issued",
    addedOn: daysAgo(17),
  },
  {
    id: "BOK-505",
    isbn: "978-81-8627-726-3",
    title: "Indian National Biology",
    author: "S. Chand",
    category: "Textbook",
    copies: 52,
    available: 25,
    status: "available",
    addedOn: daysAgo(21),
  },
  {
    id: "BOK-506",
    isbn: "978-0-19-881329-3",
    title: "Concise Oxford English Dictionary",
    author: "Oxford University Press",
    category: "Reference",
    copies: 12,
    available: 2,
    status: "issued",
    addedOn: daysAgo(26),
  },
  {
    id: "BOK-507",
    isbn: "978-81-264-246-0",
    title: "Mathematics Today",
    author: "New Saraswati House",
    category: "Journals",
    copies: 24,
    available: 16,
    status: "available",
    addedOn: daysAgo(30),
  },
  {
    id: "BOK-508",
    isbn: "978-81-492-935-5",
    title: "Wings of Fire",
    author: "A. P. J. Abdul Kalam",
    category: "Fiction",
    copies: 22,
    available: 9,
    status: "available",
    addedOn: daysAgo(35),
  },
  {
    id: "BOK-509",
    isbn: "978-93-5320-464-1",
    title: "Fundamentals of Economics",
    author: "NCERT",
    category: "Textbook",
    copies: 38,
    available: 11,
    status: "issued",
    addedOn: daysAgo(40),
  },
  {
    id: "BOK-510",
    isbn: "978-1-4028-9462-6",
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    category: "Fiction",
    copies: 16,
    available: 7,
    status: "available",
    addedOn: daysAgo(45),
  },
  {
    id: "BOK-511",
    isbn: "978-81-250-312-9",
    title: "Computer Science Textbook",
    author: "Sumita Arora",
    category: "Textbook",
    copies: 40,
    available: 0,
    status: "issued",
    addedOn: daysAgo(50),
  },
  {
    id: "BOK-512",
    isbn: "978-0-06-231609-7",
    title: "Sapiens: A Brief History",
    author: "Yuval Noah Harari",
    category: "Reference",
    copies: 14,
    available: 3,
    status: "issued",
    addedOn: daysAgo(57),
  },
  {
    id: "BOK-513",
    isbn: "978-81-8476-002-9",
    title: "Vigyan Pragya",
    author: "NCERT",
    category: "Journals",
    copies: 10,
    available: 0,
    status: "archived",
    addedOn: daysAgo(64),
  },
  {
    id: "BOK-514",
    isbn: "978-81-7430-915-5",
    title: "Art of Public Speaking",
    author: "Dale Carnegie",
    category: "Reference",
    copies: 20,
    available: 8,
    status: "available",
    addedOn: daysAgo(72),
  },
];

export function BooksTable() {
  const controller = useListController<Book>({
    data: MOCK_BOOKS,
    searchFields: (item) => `${item.title} ${item.author} ${item.isbn} ${item.id}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: BOOK_STATUS_OPTIONS,
      },
      {
        id: "category",
        field: "category",
        label: "Category",
        options: BOOK_CATEGORY_OPTIONS,
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
      key: "book",
      header: "Book",
      cell: (row: Book) => (
        <div className="min-w-[230px]">
          <p className="font-medium text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground">
            {row.author} &middot; {row.isbn}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (row: Book) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {row.category}
        </span>
      ),
    },
    {
      key: "copies",
      header: "Copies",
      cell: (row: Book) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
          {row.copies}
        </span>
      ),
    },
    {
      key: "available",
      header: "Available",
      cell: (row: Book) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
          {row.available}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Book) => <StatusBadge status={row.status} />,
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
            <DropdownMenuItem>Issue copy</DropdownMenuItem>
            <DropdownMenuItem>Edit details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Archive book</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<Book>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search books..."
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
      emptyTitle="No books found"
      emptyDescription="No book matches the current search or filters."
    />
  );
}
