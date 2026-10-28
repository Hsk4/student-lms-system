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

interface Board {
  id: string;
  name: string;
  authority: string;
  medium: string;
  grades: string;
  students: number;
  status: string;
  establishedOn: string;
}

const BOARD_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const BOARD_MEDIUM_OPTIONS = [
  { label: "All mediums", value: "all" },
  { label: "English", value: "English" },
  { label: "Hindi", value: "Hindi" },
  { label: "Bilingual", value: "Bilingual" },
];

const MOCK_BOARDS: Board[] = [
  {
    id: "BRD-01",
    name: "CBSE",
    authority: "Central Board of Secondary Education",
    medium: "English",
    grades: "I - XII",
    students: 1240,
    status: "active",
    establishedOn: daysAgo(900),
  },
  {
    id: "BRD-02",
    name: "ICSE",
    authority: "Council for the Indian School Certificate",
    medium: "English",
    grades: "I - X",
    students: 610,
    status: "active",
    establishedOn: daysAgo(760),
  },
  {
    id: "BRD-03",
    name: "State Board (Maharashtra)",
    authority: "Maharashtra State Board",
    medium: "Bilingual",
    grades: "I - X",
    students: 430,
    status: "active",
    establishedOn: daysAgo(640),
  },
  {
    id: "BRD-04",
    name: "IB",
    authority: "International Baccalaureate Organization",
    medium: "English",
    grades: "IX - XII",
    students: 185,
    status: "active",
    establishedOn: daysAgo(520),
  },
  {
    id: "BRD-05",
    name: "Cambridge (IGCSE)",
    authority: "Cambridge Assessment International Education",
    medium: "English",
    grades: "VIII - XII",
    students: 140,
    status: "active",
    establishedOn: daysAgo(430),
  },
  {
    id: "BRD-06",
    name: "CISCE - Kodaikanal",
    authority: "Auxiliary Learning Centre",
    medium: "English",
    grades: "I - XII",
    students: 95,
    status: "inactive",
    establishedOn: daysAgo(380),
  },
  {
    id: "BRD-07",
    name: "NCERT State Syllabus",
    authority: "State Council of Educational Research",
    medium: "Hindi",
    grades: "I - VIII",
    students: 320,
    status: "active",
    establishedOn: daysAgo(310),
  },
  {
    id: "BRD-08",
    name: "IGCSE A Level",
    authority: "Cambridge International",
    medium: "English",
    grades: "XI - XII",
    students: 76,
    status: "active",
    establishedOn: daysAgo(260),
  },
  {
    id: "BRD-09",
    name: "CBSE Vocational",
    authority: "Central Board of Secondary Education",
    medium: "Hindi",
    grades: "IX - XII",
    students: 210,
    status: "active",
    establishedOn: daysAgo(205),
  },
  {
    id: "BRD-10",
    name: "Montessori",
    authority: "Association of Montessori Internationale",
    medium: "English",
    grades: "I - VI",
    students: 120,
    status: "active",
    establishedOn: daysAgo(150),
  },
  {
    id: "BRD-11",
    name: "Special Needs Curriculum",
    authority: "Inclusive Education Board",
    medium: "Bilingual",
    grades: "I - X",
    students: 48,
    status: "inactive",
    establishedOn: daysAgo(95),
  },
  {
    id: "BRD-12",
    name: "School Internal Syllabus",
    authority: "Academic Council, Vidyalaya",
    medium: "English",
    grades: "I - XII",
    students: 1500,
    status: "active",
    establishedOn: daysAgo(60),
  },
];

export function BoardsTable() {
  const controller = useListController<Board>({
    data: MOCK_BOARDS,
    searchFields: (item) => `${item.name} ${item.authority} ${item.id}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: BOARD_STATUS_OPTIONS,
      },
      {
        id: "medium",
        field: "medium",
        label: "Medium",
        options: BOARD_MEDIUM_OPTIONS,
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
      key: "board",
      header: "Board",
      cell: (row: Board) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.authority}</p>
        </div>
      ),
    },
    {
      key: "medium",
      header: "Medium",
      cell: (row: Board) => (
        <span className="text-sm text-muted-foreground">{row.medium}</span>
      ),
    },
    {
      key: "grades",
      header: "Grades",
      cell: (row: Board) => (
        <span className="whitespace-nowrap text-sm text-foreground">
          {row.grades}
        </span>
      ),
    },
    {
      key: "students",
      header: "Students",
      cell: (row: Board) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
          {row.students.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Board) => <StatusBadge status={row.status} />,
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
            <DropdownMenuItem>View curriculum</DropdownMenuItem>
            <DropdownMenuItem>Edit board</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<Board>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search boards..."
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
      emptyTitle="No boards found"
      emptyDescription="No academic board matches the current filters."
    />
  );
}
