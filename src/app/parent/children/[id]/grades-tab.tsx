"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { getGradePointsBySubjectForChild } from "@/app/parent/mock/data";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateOnly } from "@/lib/format";

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return <span className="text-xs text-muted-foreground">—</span>;

  const width = 72;
  const height = 24;
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const span = max - min || 1;
  const stepX = width / (values.length - 1);

  const path = values
    .map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-6 w-[72px]" aria-hidden="true">
      <path
        d={path}
        fill="none"
        strokeWidth="2"
        className="stroke-primary"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GradesTab({ childId }: { childId: string }) {
  const subjects = React.useMemo(
    () => getGradePointsBySubjectForChild(childId),
    [childId],
  );

  if (subjects.length === 0) {
    return (
      <EmptyState
        title="No grades yet"
        description="Grades appear here when teachers mark quizzes, tests and assignments."
        className="rounded-xl"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {subjects.map((subject) => (
        <SubjectGradesCard key={subject.subject} subject={subject} />
      ))}
    </div>
  );
}

interface SubjectGradesCardProps {
  subject: ReturnType<typeof getGradePointsBySubjectForChild>[number];
}

function SubjectGradesCard({ subject }: SubjectGradesCardProps) {
  const [open, setOpen] = React.useState(false);
  const Chevron = open ? ChevronUp : ChevronDown;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60"
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            {subject.subject}
          </span>
          <span className="block text-xs text-muted-foreground">
            Teacher · {subject.teacherName}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-sm font-semibold tabular-nums text-foreground">
            {subject.average}%
          </span>
          <span className="block text-[10px] text-muted-foreground">average</span>
        </span>
        <Sparkline values={subject.trend} />
        <Chevron className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open ? (
        <ul className="divide-y divide-border/70 border-t border-border">
          {subject.items.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateOnly(item.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {item.score}/{item.max}
                  </span>
                  <Badge variant="accent" className="text-[10px]">
                    {Math.round((item.score / item.max) * 100)}%
                  </Badge>
                </div>
              </div>
              {item.comment ? (
                <p className="mt-1.5 text-xs italic text-muted-foreground">
                  Teacher comment: {item.comment}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
