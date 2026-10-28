"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EnrollmentStatus, LinkedChild } from "@/app/parent/mock/types";

const STATUS_CHIP: Record<EnrollmentStatus, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  awaiting_teacher:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  none: "bg-secondary text-muted-foreground",
};

function AttendanceRing({ percent }: { percent: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (percent / 100);

  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 52 52" className="h-14 w-14 -rotate-90">
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          strokeWidth="5"
          className="stroke-secondary"
        />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dasharray] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-foreground">
        {percent}%
      </span>
    </div>
  );
}

interface ChildSummarySectionProps {
  childrenList: LinkedChild[];
  className?: string;
}

export function ChildSummarySection({
  childrenList,
  className,
}: ChildSummarySectionProps) {
  if (childrenList.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center shadow-sm",
          className,
        )}
      >
        <p className="text-sm font-medium text-foreground">No children linked yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Ask your child to send you an invite from the student panel.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 lg:grid lg:grid-flow-col lg:auto-cols-fr lg:overflow-visible",
        className,
      )}
    >
      {childrenList.map((child) => (
        <ChildSummaryCard key={child.id} child={child} snap />
      ))}
    </div>
  );
}

function ChildSummaryCard({ child, snap }: { child: LinkedChild; snap?: boolean }) {
  const hasEnrollment = child.status === "active";

  return (
    <article
      className={cn(
        "min-w-[260px] flex-1 snap-start rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        snap && "lg:min-w-0",
      )}
      aria-label={child.name}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {child.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{child.name}</p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                STATUS_CHIP[child.status],
              )}
            >
              {child.status === "active"
                ? "Active"
                : child.status === "awaiting_teacher"
                  ? "Awaiting teacher"
                  : "No enrollment"}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {child.board} · {child.level}
          </p>
        </div>
      </div>

      {hasEnrollment ? (
        <div className="mt-4 flex items-center gap-4">
          <div className="text-center">
            <AttendanceRing percent={child.attendancePercent} />
            <p className="mt-1 text-[10px] text-muted-foreground">Attendance</p>
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="flex items-baseline gap-1">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {child.averageGradePercent}%
              </span>
              <span className="text-xs text-muted-foreground">avg grade</span>
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              {child.assignmentsDueThisWeek} due this week
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-3 text-center text-xs text-muted-foreground">
          Grades and attendance will appear once enrolled.
        </div>
      )}

      <div className="mt-3 border-t border-border/70 pt-3">
        <Link
          href={`/parent/children/${child.id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View details
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
