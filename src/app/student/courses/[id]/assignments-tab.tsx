"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { StudentCourse } from "@/app/student/courses/courses-list";
import {
  MOCK_STUDENT_ASSIGNMENTS,
} from "@/app/student/assignments/assignments-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/format";

export function CourseAssignmentsTab({ course }: { course: StudentCourse }) {
  const assignments = MOCK_STUDENT_ASSIGNMENTS.filter(
    (assignment) => assignment.courseId === course.id,
  );

  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        description={`The teacher has not posted any ${course.subject} assignments yet.`}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border/70">
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <Link
              href={`/student/assignments/${assignment.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {assignment.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Due {formatDateTime(assignment.dueDate)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={assignment.status} />
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
