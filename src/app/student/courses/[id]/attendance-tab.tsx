"use client";

import * as React from "react";

import type { StudentCourse } from "@/app/student/courses/courses-list";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent" | "holiday" | "upcoming";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  holiday: "text-muted-foreground/40",
  upcoming: "bg-secondary text-muted-foreground",
};

interface AttendanceCell {
  day: number | null;
  status: AttendanceStatus | null;
}

export function AttendanceTab({ course }: { course: StudentCourse }) {
  void course;

  const { monthLabel, cells, present, absent } = React.useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const monthLabel = today.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });

    const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const monthEnd = new Date(year, month + 1, 0).getDate();

    const grid: AttendanceCell[] = Array.from({ length: startOffset }, () => ({
      day: null,
      status: null,
    }));

    let present = 0;
    let absent = 0;

    for (let day = 1; day <= monthEnd; day += 1) {
      const weekday = new Date(year, month, day).getDay();
      let status: AttendanceStatus;
      if (day > today.getDate()) {
        status = "upcoming";
      } else if (weekday === 0) {
        status = "holiday";
      } else {
        status = day % 5 === 0 ? "absent" : "present";
      }
      if (status === "present") present += 1;
      if (status === "absent") absent += 1;
      grid.push({ day, status });
    }

    while (grid.length % 7 !== 0) {
      grid.push({ day: null, status: null });
    }

    return { monthLabel, cells: grid, present, absent };
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
          <span className="text-xs text-muted-foreground">Attendance</span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              className="pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {weekday}
            </span>
          ))}
          {cells.map((cell, index) => (
            <span
              key={index}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-xs",
                cell.day ? STATUS_STYLES[cell.status as AttendanceStatus] : "",
              )}
            >
              {cell.day ?? ""}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Days present</span>
              <Badge variant="success">{present}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Days absent</span>
              <Badge variant="destructive">{absent}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rate</span>
              <Badge variant="secondary">
                {present + absent > 0
                  ? `${Math.round((present / (present + absent)) * 100)}%`
                  : "—"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Legend</h3>
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-emerald-200 dark:bg-emerald-900" />
              Present
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-red-200 dark:bg-red-900" />
              Absent
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-secondary" />
              Upcoming
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
