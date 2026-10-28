"use client";

import * as React from "react";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { cn } from "@/lib/utils";
import { useCurrentParent } from "@/hooks/use-current-parent";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import type { EnrollmentStatus } from "@/app/parent/mock/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateOnly } from "@/lib/format";

const STATUS_CHIP: Record<EnrollmentStatus, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  awaiting_teacher:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  none: "bg-secondary text-muted-foreground",
};

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  active: "Active",
  awaiting_teacher: "Awaiting teacher",
  none: "No enrollment",
};

export function ChildrenPageInner() {
  const { linkedChildren, scopedChildId } = useCurrentParent();
  const controller = useMockPageLoad();

  if (controller.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-72 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      </div>
    );
  }

  if (controller.isError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Children
        </h2>
        <ErrorState
          onRetry={controller.retry}
          description="We could not load your linked children. Please try again."
        />
      </div>
    );
  }

  const visibleChildren = linkedChildren.filter(
    (child) => scopedChildId === "all" || child.id === scopedChildId,
  );

  const headingLabel =
    scopedChildId === "all"
      ? `${linkedChildren.length} children linked`
      : "1 child in view";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Children
        </h2>
        <p className="text-sm text-muted-foreground">{headingLabel}</p>
      </div>

      {visibleChildren.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No children linked yet"
          description="Ask your child to send you an invite."
          className="rounded-xl"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleChildren.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserPlus className="h-3.5 w-3.5 shrink-0" />
        New invites are sent by your children from the student panel.
      </p>
    </div>
  );
}

function ChildCard({ child }: { child: ReturnType<typeof useCurrentParent>["linkedChildren"][number] }) {
  return (
    <Link
      href={`/parent/children/${child.id}`}
      className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {child.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {child.name}
            </p>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                STATUS_CHIP[child.status],
              )}
            >
              {STATUS_LABEL[child.status]}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {child.board} · {child.level}
          </p>
        </div>
      </div>

      {child.subjects.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {child.subjects.map((subject) => (
            <span
              key={subject.id}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
            >
              {subject.subject}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">No subjects enrolled yet.</p>
      )}

      {child.teachers.length > 0 ? (
        <p className="mt-3 truncate text-xs text-muted-foreground">
          Teachers:{" "}
          <span className="font-medium text-foreground">
            {child.teachers.map((teacher) => teacher.name).join(", ")}
          </span>
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Awaiting teacher assignment.
        </p>
      )}

      <p className="mt-4 border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
          Linked since {formatDateOnly(child.linkDate)}
      </p>
    </Link>
  );
}
