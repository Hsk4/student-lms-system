"use client";

import type { StudentCourse } from "@/app/student/courses/courses-list";
import { Badge } from "@/components/ui/badge";
import { formatDateOnly } from "@/lib/format";

export function OverviewTab({ course }: { course: StudentCourse }) {
  const details = [
    { label: "Board", value: course.board },
    { label: "Level", value: course.level },
    { label: "Format", value: course.mode },
    { label: "Schedule", value: course.schedule },
    {
      label: "Next class",
      value: course.nextClass
        ? formatDateOnly(course.nextClass)
        : "Not scheduled",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
        <h3 className="text-sm font-semibold text-foreground">
          About this course
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="accent">{course.board} board</Badge>
          <Badge variant="outline">{course.subject}</Badge>
          <Badge variant="secondary">{course.mode}</Badge>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">Details</h3>
        <dl className="mt-3 divide-y divide-border/70">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center justify-between gap-3 py-2"
            >
              <dt className="text-xs text-muted-foreground">{detail.label}</dt>
              <dd className="text-right text-sm text-foreground">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
