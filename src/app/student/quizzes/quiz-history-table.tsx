"use client";

import * as React from "react";
import { Bug, ChevronRight } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Badge, type BadgeProps } from "@/components/ui/badge";
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

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface StudentQuizHistoryRow {
  id: string;
  course: string;
  date: string;
  score: number;
  max: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    prompt: "What is the SI unit of force?",
    options: ["Newton", "Kilogram", "Joule", "Watt"],
    correctIndex: 0,
  },
  {
    prompt: "Solve for x: 2x + 6 = 0",
    options: ["-3", "3", "-2", "0"],
    correctIndex: 0,
  },
  {
    prompt: "Which gas do plants absorb for photosynthesis?",
    options: ["Nitrogen", "Carbon dioxide", "Hydrogen", "Helium"],
    correctIndex: 1,
  },
  {
    prompt: "Average speed is equal to",
    options: [
      "distance × time",
      "time / distance",
      "distance / time",
      "mass × velocity",
    ],
    correctIndex: 2,
  },
  {
    prompt: "Which of these is a fossil fuel?",
    options: ["Firewood", "Wind", "Sunlight", "Coal"],
    correctIndex: 3,
  },
];

export const QUIZ_DRAFT_KEY = "student-quiz-draft";
export const QUIZ_RESULT_KEY = "student-quiz-result";

export function quizPercentLabel(score: number, max: number): {
  label: string;
  variant: NonNullable<BadgeProps["variant"]>;
} {
  const percent = Math.round((score / max) * 100);
  if (percent >= 80) return { label: `${percent}%`, variant: "success" };
  if (percent >= 60) return { label: `${percent}%`, variant: "warning" };
  return { label: `${percent}%`, variant: "destructive" };
}

export const MOCK_QUIZ_HISTORY: StudentQuizHistoryRow[] = [
  { id: "qz-301", course: "Physics", date: dateIn(-14, 20, 0), score: 4, max: 5 },
  { id: "qz-302", course: "Mathematics", date: dateIn(-9, 20, 0), score: 3, max: 5 },
  { id: "qz-303", course: "Chemistry", date: dateIn(-5, 20, 0), score: 5, max: 5 },
  { id: "qz-304", course: "Physics", date: dateIn(-4, 20, 0), score: 2, max: 5 },
  { id: "qz-305", course: "English", date: dateIn(-2, 20, 0), score: 4, max: 5 },
  { id: "qz-306", course: "Mathematics", date: dateIn(-1, 20, 0), score: 5, max: 5 },
];

const QUIZ_COURSE_OPTIONS = [
  { label: "All courses", value: "all" },
  ...Array.from(new Set(MOCK_QUIZ_HISTORY.map((row) => row.course))).map(
    (course) => ({ label: course, value: course }),
  ),
];

interface QuizHistoryTableProps {
  rows: StudentQuizHistoryRow[];
}

export function QuizHistoryTable({ rows }: QuizHistoryTableProps) {
  const controller = useListController<StudentQuizHistoryRow>({
    data: rows,
    searchFields: (row) => row.course,
    filters: [
      {
        id: "course",
        field: "course",
        label: "Course",
        options: QUIZ_COURSE_OPTIONS,
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
        searchPlaceholder="Search quiz history..."
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
      ) : controller.rows.length === 0 ? (
        <EmptyState
          title="No quizzes attempted yet"
          description="Start a new practice quiz and your scores will be tracked here."
        />
      ) : (
        <React.Fragment>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percent</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {controller.rows.map((row) => {
                  const percent = quizPercentLabel(row.score, row.max);
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <span className="font-medium text-foreground">
                          {row.course} practice quiz
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDateOnly(row.date)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
                          {row.score}/{row.max}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={percent.variant}>
                          {percent.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:hidden">
            {controller.rows.map((row) => {
              const percent = quizPercentLabel(row.score, row.max);
              return (
                <div
                  key={row.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {row.course} practice quiz
                    </p>
                    <Badge variant={percent.variant}>{percent.label}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDateOnly(row.date)}</span>
                    <span className="tabular-nums text-foreground">
                      {row.score}/{row.max}
                    </span>
                  </div>
                </div>
              );
            })}
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
