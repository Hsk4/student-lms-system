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
import { dateIn, formatDateTime } from "@/lib/format";
import type { AssignmentSubmission } from "@/app/student/assignments/[id]/submission-area";

export interface StudentAssignment {
  id: string;
  title: string;
  courseId: string;
  course: string;
  teacher: string;
  dueDate: string;
  status: "todo" | "submitted" | "graded";
  score?: number;
  maxScore?: number;
  feedback?: string;
  instructions: string;
  submission?: AssignmentSubmission;
}

export const MOCK_STUDENT_ASSIGNMENTS: StudentAssignment[] = [
  {
    id: "asg-701",
    title: "Kinematics worksheet",
    courseId: "crs-2",
    course: "Physics",
    teacher: "Hina Raza",
    dueDate: dateIn(1, 17, 0),
    status: "todo",
    instructions:
      "Complete the motion graphs worksheet from page 42 to 45. Show your working for every calculation and attach a photo of your graph sketches if they are on paper.",
  },
  {
    id: "asg-702",
    title: "Quadratics practice set",
    courseId: "crs-1",
    course: "Mathematics",
    teacher: "Faisal Iqbal",
    dueDate: dateIn(2, 17, 0),
    status: "todo",
    instructions:
      "Solve questions 1 to 20 in the practice booklet. Use the factorising method from Monday's session and type your answers into the note box.",
  },
  {
    id: "asg-703",
    title: "Periodic table lab report",
    courseId: "crs-3",
    course: "Chemistry",
    teacher: "Salman Baig",
    dueDate: dateIn(-1, 17, 0),
    status: "submitted",
    instructions:
      "Write up the reactivity experiment using the lab report template. Include your observations and one conclusion sentence.",
    submission: {
      note: "Observations were recorded for three metals; conclusion links reactivity to group position.",
      fileName: "lab-report-reactivity.pdf",
      fileSize: 428352,
      submittedAt: dateIn(-1, 16, 12),
    },
  },
  {
    id: "asg-704",
    title: "Algebra quiz corrections",
    courseId: "crs-1",
    course: "Mathematics",
    teacher: "Faisal Iqbal",
    dueDate: dateIn(3, 17, 0),
    status: "todo",
    instructions:
      "Redo the four questions you lost marks on in last week's quiz. Explain what went wrong the first time.",
  },
  {
    id: "asg-705",
    title: "Essay: River valley civilisations",
    courseId: "crs-4",
    course: "English",
    teacher: "Naveed Tariq",
    dueDate: dateIn(5, 17, 0),
    status: "todo",
    instructions:
      "Write a 500-word persuasive essay on why river valleys supported the first urban centres. Follow the structure template shared in materials.",
  },
  {
    id: "asg-706",
    title: "Bonding basics worksheet",
    courseId: "crs-3",
    course: "Chemistry",
    teacher: "Salman Baig",
    dueDate: dateIn(4, 15, 0),
    status: "todo",
    instructions:
      "Classify each of the ten compounds as ionic or covalent and justify two of your choices.",
  },
  {
    id: "asg-707",
    title: "Pendulum mini-report",
    courseId: "crs-3",
    course: "Physics",
    teacher: "Hina Raza",
    dueDate: dateIn(-4, 17, 0),
    status: "graded",
    score: 14,
    maxScore: 15,
    feedback:
      "Excellent measurement technique. Your conclusion was strong, but add uncertainty notes next time.",
    instructions:
      "Time a pendulum through 10 full swings for three different lengths, tabulate your results and estimate g.",
  },
  {
    id: "asg-708",
    title: "Quadratic functions quiz",
    courseId: "crs-1",
    course: "Mathematics",
    teacher: "Faisal Iqbal",
    dueDate: dateIn(-9, 17, 0),
    status: "graded",
    score: 7,
    maxScore: 10,
    feedback:
      "Good work on factoring. Revise the completing-the-square steps we practised together.",
    instructions:
      "Complete the mixed quiz covering factoring and completing the square within 25 minutes.",
  },
  {
    id: "asg-709",
    title: "Persuasive letter to the editor",
    courseId: "crs-4",
    course: "English",
    teacher: "Naveed Tariq",
    dueDate: dateIn(-7, 17, 0),
    status: "submitted",
    instructions:
      "Draft a persuasive letter about a local issue using three supporting arguments.",
    submission: {
      note: "Chose the school bus route issue with three arguments and a call to action.",
      fileName: null,
      fileSize: null,
      submittedAt: dateIn(-2, 21, 5),
    },
  },
  {
    id: "asg-710",
    title: "Balancing equations drill",
    courseId: "crs-3",
    course: "Chemistry",
    teacher: "Salman Baig",
    dueDate: dateIn(-14, 17, 0),
    status: "graded",
    score: 19,
    maxScore: 20,
    feedback: "All balanced correctly. Very neat working, well done.",
    instructions:
      "Balance the twenty chemical equations from the drill sheet and annotate which type each reaction is.",
  },
];

const ASSIGNMENT_COURSE_OPTIONS = [
  { label: "All courses", value: "all" },
  ...Array.from(new Set(MOCK_STUDENT_ASSIGNMENTS.map((a) => a.course))).map(
    (course) => ({ label: course, value: course }),
  ),
];

interface AssignmentsTableProps {
  data: StudentAssignment[];
  emptyTitle: string;
}

export function AssignmentsTable({
  data,
  emptyTitle,
}: AssignmentsTableProps) {
  const router = useRouter();
  const controller = useListController<StudentAssignment>({
    data,
    searchFields: (assignment) =>
      `${assignment.title} ${assignment.course} ${assignment.teacher}`,
    filters: [
      {
        id: "course",
        field: "course",
        label: "Course",
        options: ASSIGNMENT_COURSE_OPTIONS,
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

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar
        searchPlaceholder="Search assignments..."
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
        <LoadingSkeleton rows={5} columns={5} />
      ) : controller.isError ? (
        <ErrorState onRetry={controller.retry} />
      ) : controller.rows.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description="No assignment matches the current search or filters."
        />
      ) : (
        <React.Fragment>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {controller.rows.map((assignment) => (
                  <TableRow
                    key={assignment.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/student/assignments/${assignment.id}`)
                    }
                  >
                    <TableCell>
                      <p className="min-w-[180px] font-medium text-foreground">
                        {assignment.title}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {assignment.course}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDateTime(assignment.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={assignment.status} />
                    </TableCell>
                    <TableCell>
                      {assignment.status === "graded" &&
                      assignment.score !== undefined &&
                      assignment.maxScore ? (
                        <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
                          {assignment.score}/{assignment.maxScore}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:hidden">
            {controller.rows.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/student/assignments/${assignment.id}`}
                className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {assignment.title}
                  </p>
                  <StatusBadge status={assignment.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {assignment.course} · {assignment.teacher}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Due {formatDateTime(assignment.dueDate)}</span>
                  {assignment.status === "graded" &&
                  assignment.score !== undefined &&
                  assignment.maxScore ? (
                    <span className="tabular-nums text-foreground">
                      Score {assignment.score}/{assignment.maxScore}
                    </span>
                  ) : null}
                </div>
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
