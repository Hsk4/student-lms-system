"use client";

import * as React from "react";
import { BookOpenCheck, Percent, Timer, UserCheck } from "lucide-react";

import { GradeTrendChart } from "@/app/parent/children/[id]/grade-trend-chart";
import { getChildById } from "@/app/parent/mock/data";
import {
  getAssignmentsForChild,
  getGradeTrendForChild,
  getTeacherFeedbackForChild,
} from "@/app/parent/mock/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateOnly } from "@/lib/format";

export function OverviewTab({ childId }: { childId: string }) {
  const child = getChildById(childId);
  const [range, setRange] = React.useState<"30d" | "term">("30d");

  const trendFull = React.useMemo(() => getGradeTrendForChild(childId), [childId]);

  const feedback = React.useMemo(
    () => getTeacherFeedbackForChild(childId),
    [childId],
  );

  const assignments = React.useMemo(
    () => getAssignmentsForChild(childId),
    [childId],
  );

  if (!child) return <EmptyState title="Child not linked" />;

  const completedCount = assignments.filter(
    (item) => item.status === "graded" || item.status === "submitted",
  ).length;
  const upcomingDeadlines = assignments.filter((item) => item.status === "due");

  const rangePoints = range === "30d" ? trendFull.slice(-8) : trendFull;

  if (child.status !== "active") {
    return (
      <EmptyState
        title="Not enrolled yet"
        description="Overview stats appear once your child starts sessions with a teacher."
        className="rounded-xl"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Percent}
          label="Avg grade"
          value={`${child.averageGradePercent}%`}
        />
        <StatCard
          icon={UserCheck}
          label="Attendance"
          value={`${child.attendancePercent}%`}
        />
        <StatCard
          icon={BookOpenCheck}
          label="Completed"
          value={`${completedCount}/${assignments.length}`}
        />
        <StatCard
          icon={Timer}
          label="Upcoming deadlines"
          value={String(upcomingDeadlines.length)}
        />
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Grade trend</h3>
            <p className="text-xs text-muted-foreground">
              Average of recent graded work
            </p>
          </div>
          <Select value={range} onValueChange={(value) => setRange(value as "30d" | "term")}>
            <SelectTrigger className="w-[170px]" aria-label="Trend range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="term">Full term</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <GradeTrendChart points={rangePoints} />
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">
            Latest teacher feedback
          </h3>
        </div>
        {feedback.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No feedback from teachers yet.
          </div>
        ) : (
          <ul className="divide-y divide-border/70">
            {feedback.map((item) => (
              <li key={item.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {item.teacherName}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {item.subject}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateOnly(item.date)}
                  </p>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  “{item.excerpt}”
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
