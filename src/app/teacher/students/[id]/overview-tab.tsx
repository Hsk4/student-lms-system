"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradeTrendChart } from "@/app/parent/children/[id]/grade-trend-chart";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import {
  getGradeTrendPoints,
  getStudentActivity,
  getStudentById,
} from "@/app/teacher/mock/data";
import { formatDateTime } from "@/lib/format";

export function OverviewTab({ studentId }: { studentId: string }) {
  const load = useMockPageLoad({ delay: 450 });
  const student = getStudentById(studentId);

  if (load.isLoading || !student) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-secondary" />
        ))}
        <div className="h-64 animate-pulse rounded-xl bg-secondary sm:col-span-3" />
      </div>
    );
  }

  const stats = [
    { label: "Average grade", value: `${student.averageGradePercent}%` },
    { label: "Attendance", value: `${student.attendancePercent}%` },
    { label: "On-time submissions", value: `${student.onTimeSubmissionPercent}%` },
  ];

  const trend = getGradeTrendPoints(studentId);
  const activity = getStudentActivity(studentId);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Grade trend</CardTitle>
        </CardHeader>
        <CardContent>
          <GradeTrendChart points={trend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No activity yet for this student.
            </p>
          ) : (
            <ul className="divide-y divide-border/70">
              {activity.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <p className="min-w-0 truncate text-sm text-foreground">{item.text}</p>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(item.at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
