"use client";

import * as React from "react";

import type { StudentCourse } from "@/app/student/courses/courses-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatDateOnly } from "@/lib/format";

interface CourseGrade {
  id: string;
  title: string;
  type: string;
  date: string;
  score: number;
  max: number;
}

const GRADES_BY_COURSE: Record<string, CourseGrade[]> = {
  "crs-1": [
    { id: "grd-11", title: "Quadratics unit test", type: "Test", date: "2026-09-18", score: 18, max: 20 },
    { id: "grd-12", title: "Factorising assignment", type: "Assignment", date: "2026-10-02", score: 14, max: 15 },
    { id: "grd-13", title: "Pop quiz: polynomials", type: "Quiz", date: "2026-10-12", score: 8, max: 10 },
  ],
  "crs-3": [
    { id: "grd-31", title: "Periodic trends test", type: "Test", date: "2026-09-26", score: 21, max: 25 },
    { id: "grd-32", title: "Lab report: reactivity", type: "Assignment", date: "2026-10-08", score: 12, max: 15 },
  ],
  "crs-5": [
    { id: "grd-51", title: "Final assessment", type: "Test", date: "2026-06-20", score: 44, max: 50 },
  ],
};

function gradeForPercent(percent: number): {
  label: string;
  variant: NonNullable<BadgeProps["variant"]>;
} {
  if (percent >= 85) return { label: "A", variant: "success" };
  if (percent >= 70) return { label: "B", variant: "info" };
  if (percent >= 50) return { label: "C", variant: "warning" };
  return { label: "D", variant: "destructive" };
}

export function GradesTab({ course }: { course: StudentCourse }) {
  const grades = GRADES_BY_COURSE[course.id] ?? [];

  if (grades.length === 0) {
    return (
      <EmptyState
        title="No grades yet"
        description={`Graded work for ${course.subject} will appear here once the teacher marks it.`}
      />
    );
  }

  const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
  const totalMax = grades.reduce((sum, grade) => sum + grade.max, 0);
  const averagePercent = Math.round((totalScore / totalMax) * 100);
  const averageGrade = gradeForPercent(averagePercent);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:col-span-2">
        <ul className="divide-y divide-border/70">
          {grades.map((grade) => {
            const percent = Math.round((grade.score / grade.max) * 100);
            const gradeBadge = gradeForPercent(percent);
            return (
              <li
                key={grade.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {grade.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {grade.type} · {formatDateOnly(grade.date)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm tabular-nums text-foreground">
                    {grade.score}/{grade.max}
                  </span>
                  <Badge variant={gradeBadge.variant}>{gradeBadge.label}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">Average</h3>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {averagePercent}%
        </p>
        <Badge variant={averageGrade.variant} className="mt-2">
          Grade {averageGrade.label}
        </Badge>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Across {grades.length} graded items in {course.subject}.
        </p>
      </div>
    </div>
  );
}
