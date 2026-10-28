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

interface Course {
  id: string;
  code: string;
  title: string;
  board: string;
  grade: string;
  faculty: string;
  credits: number;
  status: string;
  updatedAt: string;
}

const COURSE_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const COURSE_BOARD_OPTIONS = [
  { label: "All boards", value: "all" },
  { label: "CBSE", value: "CBSE" },
  { label: "ICSE", value: "ICSE" },
  { label: "IB", value: "IB" },
  { label: "Cambridge (IGCSE)", value: "Cambridge (IGCSE)" },
];

const MOCK_COURSES: Course[] = [
  {
    id: "CRS-301",
    code: "MATH-10A",
    title: "Mathematics",
    board: "CBSE",
    grade: "Grade 10",
    faculty: "Mathematics",
    credits: 6,
    status: "published",
    updatedAt: daysAgo(1),
  },
  {
    id: "CRS-302",
    code: "PHY-11A",
    title: "Physics",
    board: "CBSE",
    grade: "Grade 11",
    faculty: "Science",
    credits: 6,
    status: "published",
    updatedAt: daysAgo(3),
  },
  {
    id: "CRS-303",
    code: "ENG-09B",
    title: "English Language & Literature",
    board: "ICSE",
    grade: "Grade 9",
    faculty: "Languages",
    credits: 4,
    status: "published",
    updatedAt: daysAgo(6),
  },
  {
    id: "CRS-304",
    code: "CHEM-12A",
    title: "Chemistry",
    board: "CBSE",
    grade: "Grade 12",
    faculty: "Science",
    credits: 6,
    status: "published",
    updatedAt: daysAgo(9),
  },
  {
    id: "CRS-305",
    code: "ECO-11C",
    title: "Economics",
    board: "CBSE",
    grade: "Grade 11",
    faculty: "Commerce",
    credits: 4,
    status: "draft",
    updatedAt: daysAgo(12),
  },
  {
    id: "CRS-306",
    code: "BIO-10B",
    title: "Biology",
    board: "ICSE",
    grade: "Grade 10",
    faculty: "Science",
    credits: 6,
    status: "published",
    updatedAt: daysAgo(16),
  },
  {
    id: "CRS-307",
    code: "HIST-08A",
    title: "History & Civics",
    board: "CBSE",
    grade: "Grade 8",
    faculty: "Social Science",
    credits: 4,
    status: "published",
    updatedAt: daysAgo(20),
  },
  {
    id: "CRS-308",
    code: "CS-12IB",
    title: "Computer Science",
    board: "IB",
    grade: "Grade 12",
    faculty: "Computer Science",
    credits: 6,
    status: "published",
    updatedAt: daysAgo(25),
  },
  {
    id: "CRS-309",
    code: "FR-09IG",
    title: "French Language",
    board: "Cambridge (IGCSE)",
    grade: "Grade 9",
    faculty: "Languages",
    credits: 3,
    status: "draft",
    updatedAt: daysAgo(29),
  },
  {
    id: "CRS-310",
    code: "MATH-07A",
    title: "Mathematics (Foundation)",
    board: "CBSE",
    grade: "Grade 7",
    faculty: "Mathematics",
    credits: 5,
    status: "published",
    updatedAt: daysAgo(34),
  },
  {
    id: "CRS-311",
    code: "PE-06A",
    title: "Physical Education",
    board: "CBSE",
    grade: "Grade 6",
    faculty: "Sports",
    credits: 2,
    status: "archived",
    updatedAt: daysAgo(41),
  },
  {
    id: "CRS-312",
    code: "ART-05B",
    title: "Art & Craft",
    board: "ICSE",
    grade: "Grade 5",
    faculty: "Arts",
    credits: 2,
    status: "published",
    updatedAt: daysAgo(48),
  },
  {
    id: "CRS-313",
    code: "ACC-12A",
    title: "Accountancy",
    board: "CBSE",
    grade: "Grade 12",
    faculty: "Commerce",
    credits: 6,
    status: "published",
    updatedAt: daysAgo(55),
  },
  {
    id: "CRS-314",
    code: "PSY-10C",
    title: "Psychology",
    board: "IB",
    grade: "Grade 10",
    faculty: "Social Science",
    credits: 3,
    status: "draft",
    updatedAt: daysAgo(63),
  },
];

export function CoursesTable() {
  const controller = useListController<Course>({
    data: MOCK_COURSES,
    searchFields: (item) => `${item.title} ${item.code} ${item.faculty} ${item.grade}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: COURSE_STATUS_OPTIONS,
      },
      {
        id: "board",
        field: "board",
        label: "Board",
        options: COURSE_BOARD_OPTIONS,
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
      key: "course",
      header: "Course",
      cell: (row: Course) => (
        <div className="min-w-[220px]">
          <p className="font-medium text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.code}</p>
        </div>
      ),
    },
    {
      key: "board",
      header: "Board",
      cell: (row: Course) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {row.board}
        </span>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      cell: (row: Course) => (
        <span className="whitespace-nowrap text-sm text-foreground">
          {row.grade}
        </span>
      ),
    },
    {
      key: "faculty",
      header: "Faculty",
      cell: (row: Course) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {row.faculty}
        </span>
      ),
    },
    {
      key: "credits",
      header: "Credits",
      cell: (row: Course) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
          {row.credits}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Course) => <StatusBadge status={row.status} />,
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
            <DropdownMenuItem>View syllabus</DropdownMenuItem>
            <DropdownMenuItem>Edit course</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTableView<Course>
      columns={columns}
      rows={controller.rows}
      getRowKey={(row) => row.id}
      searchPlaceholder="Search courses..."
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
      emptyTitle="No courses found"
      emptyDescription="No course matches the current search or filters."
    />
  );
}
