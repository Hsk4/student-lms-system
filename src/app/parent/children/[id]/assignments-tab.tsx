"use client";

import * as React from "react";
import { Lock } from "lucide-react";

import { getAssignmentsForChild } from "@/app/parent/mock/data";
import type { AssignmentStatus, ChildAssignment } from "@/app/parent/mock/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDateOnly, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type AssignmentFilter = "all" | AssignmentStatus;

const FILTERS: { value: AssignmentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "due", label: "Due" },
  { value: "submitted", label: "Submitted" },
  { value: "missing", label: "Missing" },
  { value: "graded", label: "Graded" },
];

const FILTER_CHIP_STYLES: Record<AssignmentStatus | "all", string> = {
  all: "border-primary bg-accent text-accent-foreground",
  due: "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  submitted:
    "border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  missing:
    "border-red-300 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  graded:
    "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
};

export function AssignmentsTab({ childId }: { childId: string }) {
  const assignments = React.useMemo(
    () => getAssignmentsForChild(childId),
    [childId],
  );
  const [filter, setFilter] = React.useState<AssignmentFilter>("all");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const visible = assignments.filter(
    (item) => filter === "all" || item.status === filter,
  );

  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        description="Assigned homework appears here once sessions start."
        className="rounded-xl"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => {
          const count =
            item.value === "all"
              ? assignments.length
              : assignments.filter((a) => a.status === item.value).length;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === item.value
                  ? FILTER_CHIP_STYLES[item.value]
                  : "border-border bg-card text-muted-foreground hover:bg-secondary",
              )}
            >
              {item.label} ({count})
            </button>
          );
        })}
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Lock className="h-3 w-3 shrink-0" />
          Submissions happen in the student panel
        </span>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing here"
          description={`No assignments with status "${filter}".`}
          className="rounded-xl"
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <ul className="divide-y divide-border/70">
            {visible.map((item) => (
              <AssignmentRow
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() =>
                  setExpandedId((current) => (current === item.id ? null : item.id))
                }
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AssignmentRow({
  item,
  expanded,
  onToggle,
}: {
  item: ChildAssignment;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition-colors hover:bg-secondary/50 sm:flex-nowrap"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
          <p className="text-xs text-muted-foreground">
            {item.subject} · Due {formatDateTime(item.dueDate)}
          </p>
        </div>
        <span className="shrink-0">{statusBadge(item.status)}</span>
        {item.status === "graded" && item.score !== undefined ? (
          <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
            {item.score}/{item.max}
          </span>
        ) : null}
      </button>

      {expanded ? (
        <div className="border-t border-border/70 bg-secondary/30 px-4 py-3">
          {item.feedback ? (
            <div>
              <p className="text-xs font-medium text-foreground">
                Teacher feedback · {formatDateOnly(item.feedbackDate ?? item.dueDate)}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.feedback}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {item.status === "submitted"
                ? "Waiting for the teacher to grade this."
                : item.status === "missing"
                  ? "This was never submitted. A teacher may follow up."
                  : "Feedback appears here after the teacher grades it."}
            </p>
          )}
        </div>
      ) : null}
    </li>
  );
}

function statusBadge(status: ChildAssignment["status"]) {
  return (
    <Badge
      variant={
        status === "graded" ? "success" : status === "due" ? "warning" : status === "missing" ? "destructive" : "info"
      }
      className="first-letter:uppercase"
    >
      {status}
    </Badge>
  );
}
