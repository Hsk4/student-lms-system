"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Lock } from "lucide-react";

import { getAttendanceSummaryForChild } from "@/app/parent/mock/data";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateOnly } from "@/lib/format";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent" | "late" | "excused" | "upcoming";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const STATUS_DAY_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  late: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  excused: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  upcoming: "bg-secondary text-muted-foreground",
};

export function AttendanceTab({ childId }: { childId: string }) {
  const summary = React.useMemo(() => getAttendanceSummaryForChild(childId), [childId]);
  const [monthOffset, setMonthOffset] = React.useState(0);

  if (summary.absent + summary.late === 0 && summary.present === 0) {
    return (
      <EmptyState
        title="No attendance yet"
        description="Attendance records appear here once sessions begin."
        icon={CalendarDays}
        className="rounded-xl"
      />
    );
  }

  const { monthLabel, cells } = buildMonth(monthOffset, childId);

  const totalDays = summary.present + summary.absent + summary.late + summary.excused;
  const percent =
    totalDays > 0
      ? Math.round(((summary.present + summary.excused) / totalDays) * 100)
      : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Previous month"
              onClick={() => setMonthOffset((value) => value - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Next month"
              disabled={monthOffset >= 0}
              onClick={() => setMonthOffset((value) => value + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
              title={cell.status && cell.status !== "upcoming" ? cellStatusTitle(cell.status) : undefined}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-xs",
                cell.day ? STATUS_DAY_STYLES[cell.status as AttendanceStatus] : "",
              )}
            >
              {cell.day ?? ""}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border/70 pt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-emerald-200 dark:bg-emerald-900" /> Present
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-red-200 dark:bg-red-900" /> Absent
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-amber-200 dark:bg-amber-900" /> Late
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-sky-200 dark:bg-sky-900" /> Excused
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-secondary" /> Upcoming
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">This term</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <SummaryRow label="Present" value={summary.present} />
            <SummaryRow label="Absent" value={summary.absent} />
            <SummaryRow label="Late" value={summary.late} />
            <SummaryRow label="Excused" value={summary.excused} />
          </div>
          <Badge variant="secondary" className="mt-3 w-full justify-center">
            {percent}% overall
          </Badge>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Absences & lates</h3>
            <ul className="space-y-2.5">
            {getMissedRecords(childId).length === 0 ? (
              <li className="text-xs text-muted-foreground">
                No absences or lates this term.
              </li>
            ) : (
              getMissedRecords(childId).map((record) => (
                <li key={record.key} className="text-xs">
                  <p className="font-medium text-foreground">
                    {formatDateOnly(record.date)} · {record.subject}
                  </p>
                  <p className="text-muted-foreground">{record.reason}</p>
                </li>
              ))
            )}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 border-t border-border/70 pt-3 text-[10px] text-muted-foreground">
            <Lock className="h-3 w-3 shrink-0" />
            Attendance is managed by the school and is read-only here.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-2.5 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

interface MonthCell {
  day: number | null;
  status: AttendanceStatus | null;
  date: string | null;
}

function cellStatusTitle(status: AttendanceStatus): string {
  if (status === "absent") return "Absent";
  if (status === "late") return "Late";
  if (status === "excused") return "Excused";
  return "Present";
}

function buildMonth(monthOffset: number, childId: string): {
  monthLabel: string;
  cells: MonthCell[];
} {
  const today = new Date();
  const reference = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthLabel = reference.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const startOffset = (reference.getDay() + 6) % 7;
  const monthEnd = new Date(reference.getFullYear(), reference.getMonth() + 1, 0).getDate();

  const cells: MonthCell[] = Array.from({ length: startOffset }, () => ({
    day: null,
    status: null,
    date: null,
  }));

  for (let day = 1; day <= monthEnd; day += 1) {
    const date = new Date(reference.getFullYear(), reference.getMonth(), day);
    const weekday = date.getDay();
    const seed = day + childId.length;
    let status: AttendanceStatus;

    if (date > today) {
      status = "upcoming";
    } else if (weekday === 0) {
      status = "upcoming";
    } else if (seed % 11 === 0) {
      status = "absent";
    } else if (seed % 13 === 0) {
      status = "late";
    } else if (seed % 17 === 0) {
      status = "excused";
    } else {
      status = "present";
    }

    cells.push({ day, status, date: date.toISOString() });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, status: null, date: null });
  }

  return { monthLabel, cells };
}

const MISSED: { [childId: string]: { key: string; date: string; subject: string; reason: string }[] } = {
  "stu-1024": [
    { key: "m1", date: "2026-10-05", subject: "Science", reason: "Fever, informed teacher in advance." },
    { key: "m2", date: "2026-10-14", subject: "English", reason: "Reached 20 minutes late due to traffic." },
  ],
  "stu-1025": [
    { key: "m3", date: "2026-10-10", subject: "Mathematics", reason: "Family function." },
    { key: "m4", date: "2026-10-16", subject: "Urdu", reason: "Late after school assembly." },
    { key: "m5", date: "2026-10-21", subject: "Mathematics", reason: "Late, bus delay." },
  ],
};

function getMissedRecords(childId: string) {
  return MISSED[childId] ?? [];
}
