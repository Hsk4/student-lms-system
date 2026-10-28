"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentAttendanceForMonth } from "@/app/teacher/mock/data";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_STYLES: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  late: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  excused: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
};

const STATUS_SHORT: Record<string, string> = {
  present: "P",
  absent: "A",
  late: "L",
  excused: "E",
};

export function StudentAttendanceTab({ studentId }: { studentId: string }) {
  const days = React.useMemo(() => getStudentAttendanceForMonth(studentId), [studentId]);
  const [monthOffset, setMonthOffset] = React.useState(0);

  const counts = days.reduce<Record<string, number>>((acc, day) => {
    if (day.status) acc[day.status] = (acc[day.status] ?? 0) + 1;
    return acc;
  }, {});

  const problems = days.filter((day) => day.status === "absent" || day.status === "late");

  const monthLabel = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + monthOffset,
    1,
  ).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  // Grid: pad the start of month so columns align Mon-first.
  const year = new Date().getFullYear();
  const monthIndex = new Date().getMonth() + monthOffset;
  const firstDay = new Date(year, monthIndex, 1);
  const startPad = (firstDay.getDay() + 6) % 7; // Monday-first offset
  const cells: (string | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...days.map((day) => day.date),
  ];

  const statusFor = (date: string) => days.find((day) => day.date === date)?.status ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["present", "absent", "late", "excused"] as const).map((status) => (
          <Card key={status}>
            <CardContent className="pt-5">
              <p className="text-2xl font-semibold text-foreground">{counts[status] ?? 0}</p>
              <p className="text-sm capitalize text-muted-foreground">{status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">{monthLabel}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMonthOffset((value) => value - 1)}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMonthOffset((value) => Math.min(0, value + 1))}
              disabled={monthOffset >= 0}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5">
            {DAY_LABELS.map((label) => (
              <p key={label} className="pb-1 text-center text-[11px] font-medium text-muted-foreground">
                {label}
              </p>
            ))}
            {cells.map((date, index) =>
              date === null ? (
                <span key={`pad-${index}`} />
              ) : (
                <span
                  key={date}
                  title={statusFor(date) ?? "No session"}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg text-xs font-medium",
                    statusFor(date) ? STATUS_STYLES[statusFor(date) as string] : "bg-secondary/50 text-muted-foreground",
                  )}
                >
                  {Number(date.slice(8, 10))}
                </span>
              ),
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(STATUS_SHORT).map(([status, short]) => (
              <Badge key={status} variant="outline" className="gap-1.5">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded text-[10px] font-semibold",
                    STATUS_STYLES[status],
                  )}
                >
                  {short}
                </span>
                <span className="capitalize">{status}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Absences &amp; lates</CardTitle>
        </CardHeader>
        <CardContent>
          {problems.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No absences or lates this month.
            </p>
          ) : (
            <ul className="divide-y divide-border/70">
              {problems.map((day) => (
                <li key={day.date} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <p className="text-sm text-foreground">
                    {new Date(day.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    })}
                    <span className="text-muted-foreground"> · Mathematics</span>
                  </p>
                  <Badge
                    variant={day.status === "absent" ? "destructive" : "warning"}
                    className="capitalize"
                  >
                    {day.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
