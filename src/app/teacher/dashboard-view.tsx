"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  FilePlus2,
  Inbox,
  Info,
  ListChecks,
  Loader2,
  Radio,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentTeacher } from "@/hooks/use-current-teacher";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import {
  getAssignmentById,
  getClassesForTeacher,
  getDashboardKpis,
  getClassPerformance,
  getNeedsAttention,
  getRecentSubmissions,
  getScheduleEventsForDate,
  getSubmissionRate,
  getUpcomingDeadlines,
  getStudentsForTeacher,
  SIMULATE_NEW_TEACHER,
} from "@/app/teacher/mock/data";
import { daysBetween } from "@/lib/date";
import { formatDateOnly, formatDateTime, formatTimeOnly } from "@/lib/format";
import { cn } from "@/lib/utils";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const KIND_ICON = {
  grading: AlertTriangle,
  request: Inbox,
  meeting: CalendarClock,
  attendance: Info,
} as const;

export function DashboardView() {
  const load = useMockPageLoad();
  const { teacher } = useCurrentTeacher();

  if (load.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-16 w-72 animate-pulse rounded-lg bg-secondary" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[65fr_35fr]">
          <div className="h-72 animate-pulse rounded-xl bg-secondary" />
          <div className="h-72 animate-pulse rounded-xl bg-secondary" />
        </div>
      </div>
    );
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load your dashboard." />;
  }

  const kpis = getDashboardKpis();
  const todayEvents = getScheduleEventsForDate(new Date());
  const needsAttention = getNeedsAttention();
  const recentSubmissions = getRecentSubmissions(5);
  const deadlines = getUpcomingDeadlines();
  const classPerformance = getClassPerformance();
  const submissionRate = getSubmissionRate();
  const now = Date.now();

  if (SIMULATE_NEW_TEACHER || getStudentsForTeacher().length === 0) {
    return <NewTeacherChecklist teacherName={teacher.name} />;
  }

  const kpiCards = [
    {
      label: "Active students",
      value: kpis.activeStudents,
      href: "/teacher/students",
      icon: Users,
    },
    {
      label: "Pending requests",
      value: kpis.pendingRequests,
      href: "/teacher/requests",
      icon: Inbox,
    },
    {
      label: "To grade",
      value: kpis.toGrade,
      href: "/teacher/grading",
      icon: ListChecks,
    },
    {
      label: "Sessions today",
      value: kpis.sessionsToday,
      href: "/teacher/attendance",
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Row 0 — greeting + quick actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {greeting()}, {teacher.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatDateOnly(new Date())} · Here is your day at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/teacher/assignments/new">
              <FilePlus2 />
              New assignment
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/teacher/attendance">
              <CalendarCheck />
              Take attendance
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/teacher/materials">
              <ClipboardList />
              Add material
            </Link>
          </Button>
        </div>
      </div>

      {/* Row 1 — KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Row 2 — schedule + needs attention */}
      <div className="grid gap-4 lg:grid-cols-[65fr_35fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Today&apos;s schedule</CardTitle>
            <Badge variant="accent">{todayEvents.length} sessions</Badge>
          </CardHeader>
          <CardContent>
            {todayEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No sessions scheduled today.
              </p>
            ) : (
              <ol className="relative flex flex-col gap-0 border-l border-border pl-6">
                {todayEvents.map((event) => {
                  const start = new Date(event.startsAt).getTime();
                  const isNow = now >= start && now <= new Date(event.endsAt).getTime();
                  const isPast = now > new Date(event.endsAt).getTime();
                  return (
                    <li key={event.id} className="relative pb-5 last:pb-0">
                      <span
                        className={cn(
                          "absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                          isNow ? "bg-primary" : isPast ? "bg-muted-foreground/40" : "bg-primary/40",
                        )}
                        aria-hidden
                      />
                      <div
                        className={cn(
                          "rounded-xl border p-3.5 transition-colors",
                          isNow
                            ? "border-primary/50 bg-accent/50"
                            : isPast
                              ? "border-border bg-secondary/40 opacity-70"
                              : "border-border bg-card hover:bg-secondary/40",
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                              {isNow ? <Radio className="h-3.5 w-3.5 text-primary" /> : null}
                              {event.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{event.subtitle}</p>
                          </div>
                          <p className="text-xs font-medium text-foreground">
                            {formatTimeOnly(event.startsAt)} – {formatTimeOnly(event.endsAt)}
                          </p>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            {event.kind === "class" ? "Class session" : event.kind === "one-on-one" ? "One-on-one" : "Parent meeting"}
                          </span>
                          {event.classId && !isPast ? (
                            <Button asChild size="sm" variant="outline" className="h-7">
                              <Link href={`/teacher/attendance?classId=${event.classId}`}>
                                <CalendarCheck />
                                Take attendance
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Needs attention</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {needsAttention.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing needs your attention.
              </p>
            ) : (
              needsAttention.map((item) => {
                const Icon = KIND_ICON[item.kind];
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        item.severity === "warning"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-accent text-accent-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.meta}
                      </span>
                    </span>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — recent submissions + deadlines */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent submissions</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/teacher/grading">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border/70">
              {recentSubmissions.map((submission) => {
                const assignment = getAssignmentById(submission.assignmentId);
                return (
                  <li key={submission.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                        {submission.studentName.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {submission.studentName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {assignment?.title} · {formatDateTime(submission.submittedAt ?? "")}
                      </p>
                    </div>
                    <StatusBadge status={submission.status} />
                    <Button asChild size="sm" variant="outline" className="hidden h-8 sm:inline-flex">
                      <Link href={`/teacher/assignments/${submission.assignmentId}`}>
                        Grade
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming deadlines</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {deadlines.map((deadline) => {
              const percent = deadline.total > 0 ? Math.round((deadline.submitted / deadline.total) * 100) : 0;
              return (
                <div key={deadline.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {deadline.title}
                    </p>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {formatDateOnly(deadline.dueDate)}
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {deadline.submitted}/{deadline.total} submitted
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Row 4 — charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class performance</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="classLabel" tickLine={false} className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip cursor={{ fill: "hsl(var(--accent))" }} />
                <Bar dataKey="averageGrade" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submission rate</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={submissionRate}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="label" tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NewTeacherChecklist({ teacherName }: { teacherName: string }) {
  const steps = [
    {
      icon: UserPlus,
      title: "Complete your profile",
      description: "Add your bio and weekly availability so the school can schedule you.",
      href: "/teacher/profile",
      done: false,
    },
    {
      icon: Inbox,
      title: "Wait for enrollment requests",
      description: "Students and parents will send requests; accept them into a class or one-on-one.",
      href: "/teacher/requests",
      done: false,
    },
    {
      icon: Users,
      title: "Create your first class",
      description: "Group students into a class with a fixed weekly schedule.",
      href: "/teacher/classes",
      done: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {greeting()}, {teacherName.split(" ")[0]}
        </h2>
        <p className="text-sm text-muted-foreground">
          Welcome! Complete these steps to set up your teaching workspace.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Getting started</h3>
        <ol className="mt-4 flex flex-col gap-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title}>
                <Link
                  href={step.href}
                  className="flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {index + 1}. {step.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {step.description}
                    </span>
                  </span>
                  <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
