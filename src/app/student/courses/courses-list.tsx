"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bug, ChevronRight } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
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
import { dateIn, formatDateOnly } from "@/lib/format";

export interface StudentCourse {
  id: string;
  subject: string;
  level: string;
  board: string;
  teacher: string;
  mode: string;
  status: string;
  assignmentsDone: number;
  assignmentsTotal: number;
  schedule: string;
  nextClass: string | null;
  started: string;
  description: string;
}

export const MOCK_STUDENT_COURSES: StudentCourse[] = [
  {
    id: "crs-1",
    subject: "Mathematics",
    level: "Grade 9",
    board: "CBSE",
    teacher: "Faisal Iqbal",
    mode: "One-on-one",
    status: "active",
    assignmentsDone: 3,
    assignmentsTotal: 5,
    schedule: "Mon & Wed, 4:30 PM",
    nextClass: dateIn(1, 16, 30),
    started: dateIn(-45, 9, 0),
    description:
      "Focused one-on-one sessions covering algebraic structures, quadratics and their graphs, with weekly practice sets to build speed.",
  },
  {
    id: "crs-2",
    subject: "Physics",
    level: "Grade 9",
    board: "CBSE",
    teacher: "Hina Raza",
    mode: "Class",
    status: "requested",
    assignmentsDone: 0,
    assignmentsTotal: 5,
    schedule: "Tue, 9:00 AM",
    nextClass: null,
    started: dateIn(-6, 9, 0),
    description:
      "Small-group class with a lab demonstration every second week. Currently pending the teacher's acceptance of your request.",
  },
  {
    id: "crs-3",
    subject: "Chemistry",
    level: "Grade 9",
    board: "CBSE",
    teacher: "Salman Baig",
    mode: "Class",
    status: "active",
    assignmentsDone: 4,
    assignmentsTotal: 6,
    schedule: "Fri, 11:00 AM",
    nextClass: dateIn(3, 11, 0),
    started: dateIn(-70, 11, 0),
    description:
      "Periodic trends, bonding basics and an introduction to organic chemistry, with assignment-based assessment.",
  },
  {
    id: "crs-4",
    subject: "English",
    level: "Grade 9",
    board: "CBSE",
    teacher: "Naveed Tariq",
    mode: "One-on-one",
    status: "declined",
    assignmentsDone: 0,
    assignmentsTotal: 5,
    schedule: "Schedule pending",
    nextClass: null,
    started: dateIn(-12, 15, 0),
    description:
      "Essay structure, comprehension technique and grammar drills in an individual coaching format.",
  },
  {
    id: "crs-5",
    subject: "Biology",
    level: "Grade 8",
    board: "CBSE",
    teacher: "Amber Qureshi",
    mode: "Class",
    status: "ended",
    assignmentsDone: 6,
    assignmentsTotal: 6,
    schedule: "Completed",
    nextClass: null,
    started: dateIn(-180, 9, 0),
    description:
      "Grade 8 life sciences completed with a final assessment. Record kept for reference.",
  },
];

const COURSE_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Active", value: "active" },
  { label: "Declined", value: "declined" },
  { label: "Ended", value: "ended" },
];

const COURSE_MODE_OPTIONS = [
  { label: "All types", value: "all" },
  { label: "Class", value: "Class" },
  { label: "One-on-one", value: "One-on-one" },
];

export function CoursesList() {
  const router = useRouter();
  const controller = useListController<StudentCourse>({
    data: MOCK_STUDENT_COURSES,
    searchFields: (course) =>
      `${course.subject} ${course.level} ${course.board} ${course.teacher}`,
    filters: [
      {
        id: "status",
        field: "status",
        label: "Status",
        options: COURSE_STATUS_OPTIONS,
      },
      {
        id: "mode",
        field: "mode",
        label: "Type",
        options: COURSE_MODE_OPTIONS,
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
      : controller.totalItems === 0
        ? controller.hasActiveFilters ? (
            <EmptyState title="No courses match" description="No course matches the current search or filters. Try clearing them." />
          ) : (
            <EmptyState
              title="No enrollments yet"
              description="You have not enrolled in any course yet. Find a teacher to get started."
              action={
                <Button asChild>
                  <Link href="/student/teachers">Find a teacher</Link>
                </Button>
              }
            />
          )
        : null;

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar
        searchPlaceholder="Search courses or teachers..."
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
        <LoadingSkeleton rows={5} columns={4} />
      ) : controller.isError ? (
        <ErrorState onRetry={controller.retry} />
      ) : empty ? (
        empty
      ) : (
        <React.Fragment>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {controller.rows.map((course) => (
                  <TableRow
                    key={course.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/student/courses/${course.id}`)}
                  >
                    <TableCell>
                      <div className="min-w-[180px]">
                        <p className="font-medium text-foreground">
                          {course.subject} · {course.level}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.board} board
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[140px]">
                        <p className="text-sm text-foreground">
                          {course.teacher}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {course.mode}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={course.status} />
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {course.assignmentsDone} of {course.assignmentsTotal}{" "}
                        assignments done
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

          <div className="flex flex-col gap-3 md:hidden">
            {controller.rows.map((course) => (
              <Link
                key={course.id}
                href={`/student/courses/${course.id}`}
                className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {course.subject} · {course.level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {course.board} board · {course.teacher}
                    </p>
                  </div>
                  <StatusBadge status={course.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{course.mode}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {course.assignmentsDone} of {course.assignmentsTotal}{" "}
                    assignments done
                  </span>
                </div>
                {course.nextClass ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Next class {formatDateOnly(course.nextClass)}
                  </p>
                ) : null}
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
