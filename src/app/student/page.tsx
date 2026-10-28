"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  Bug,
  ChevronRight,
  Clock,
  GraduationCap,
  Receipt,
  UserX,
} from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useCurrentStudent,
  type StudentProfile,
} from "@/hooks/use-current-student";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { dateIn, formatDateTime, formatRs } from "@/lib/format";

interface HomeEnrollment {
  id: string;
  teacher: string;
  subject: string;
  mode: string;
  nextClass: string | null;
  status: string;
}

interface HomeAssignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: string;
}

interface HomeBook {
  id: string;
  title: string;
  author: string;
}

const HOME_ENROLLMENTS: HomeEnrollment[] = [
  {
    id: "enr-301",
    teacher: "Faisal Iqbal",
    subject: "Mathematics",
    mode: "One-on-one",
    nextClass: dateIn(1, 16, 30),
    status: "active",
  },
  {
    id: "enr-302",
    teacher: "Hina Raza",
    subject: "Physics",
    mode: "Class",
    nextClass: dateIn(2, 9, 0),
    status: "requested",
  },
  {
    id: "enr-303",
    teacher: "Salman Baig",
    subject: "Chemistry",
    mode: "Class",
    nextClass: dateIn(3, 11, 0),
    status: "active",
  },
];

const HOME_DUE_SOON: HomeAssignment[] = [
  {
    id: "asg-701",
    title: "Kinematics worksheet",
    course: "Physics",
    dueDate: dateIn(1, 17, 0),
    status: "todo",
  },
  {
    id: "asg-702",
    title: "Quadratics practice set",
    course: "Mathematics",
    dueDate: dateIn(2, 17, 0),
    status: "todo",
  },
  {
    id: "asg-703",
    title: "Periodic table lab report",
    course: "Chemistry",
    dueDate: dateIn(4, 17, 0),
    status: "submitted",
  },
  {
    id: "asg-704",
    title: "Algebra quiz corrections",
    course: "Mathematics",
    dueDate: dateIn(5, 17, 0),
    status: "todo",
  },
  {
    id: "asg-705",
    title: "Essay: River valley civilizations",
    course: "History",
    dueDate: dateIn(6, 17, 0),
    status: "todo",
  },
];

const HOME_BOOKS: HomeBook[] = [
  {
    id: "book-11",
    title: "Foundation Physics: Waves",
    author: "P. Mohan",
  },
  {
    id: "book-12",
    title: "Algebra Unlocked",
    author: "R. Fernandes",
  },
  {
    id: "book-13",
    title: "Chemistry in Motion",
    author: "S. Kulkarni",
  },
];

function greetingForDate(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudentHomePage() {
  const student: StudentProfile = useCurrentStudent();
  const controller = useMockPageLoad();
  const [showEmptyDemo, setShowEmptyDemo] = React.useState(false);

  const enrollments = showEmptyDemo ? [] : HOME_ENROLLMENTS;
  const firstName = student.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {greetingForDate()}, {firstName}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{student.board}</Badge>
            <Badge variant="secondary">{student.level}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={showEmptyDemo ? "destructive" : "outline"}
            size="sm"
            onClick={() => setShowEmptyDemo(!showEmptyDemo)}
            title="Dev toggle: preview the no-enrollments empty home"
          >
            <UserX />
            Empty demo
          </Button>
          <Button
            type="button"
            variant={controller.simulateError ? "destructive" : "outline"}
            size="sm"
            onClick={() => controller.setSimulateError(!controller.simulateError)}
            title="Dev toggle: simulate a failed request"
          >
            <Bug />
            Simulate error
          </Button>
        </div>
      </div>

      {controller.isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-6 w-40" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-xl" />
            ))}
          </div>
          <LoadingSkeleton rows={5} columns={3} />
        </div>
      ) : controller.isError ? (
        <ErrorState
          title="We could not load your dashboard"
          description="Your classes, assignments and fees could not be loaded just now. Try again."
          onRetry={controller.retry}
        />
      ) : enrollments.length === 0 ? (
        <EmptyHome />
      ) : (
        <React.Fragment>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                My teachers
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {enrollment.teacher}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment.subject}
                      </p>
                    </div>
                    <Badge variant="secondary">{enrollment.mode}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {enrollment.nextClass
                      ? formatDateTime(enrollment.nextClass)
                      : "Schedule pending"}
                  </div>
                  {enrollment.status === "requested" ? (
                    <StatusBadge status="requested" label="Requested" />
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-5">
            <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm lg:col-span-3">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Due soon
                </h3>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                >
                  <Link href="/student/assignments">
                    See all
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
              <ul className="divide-y divide-border/70">
                {HOME_DUE_SOON.map((assignment) => (
                  <li key={assignment.id}>
                    <Link
                      href="/student/assignments"
                      className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.course}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="hidden text-xs text-muted-foreground sm:inline">
                          {formatDateTime(assignment.dueDate)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Receipt className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    Fees due
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  {formatRs(24000)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Next due {formatDateTime(dateIn(4, 17, 0))}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                >
                  <Link href="/student/invoices">View fees</Link>
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <BookMarked className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      Books
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                  >
                    <Link href="/student/books">See all</Link>
                  </Button>
                </div>
                <ul className="mt-3 divide-y divide-border/70">
                  {HOME_BOOKS.map((book) => (
                    <li
                      key={book.id}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground">
                          {book.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {book.author}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </React.Fragment>
      )}
    </div>
  );
}

function EmptyHome() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <GraduationCap className="h-7 w-7" />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Let&apos;s find your first teacher
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          You have no enrollments yet. Once a teacher accepts your request, your
          classes, assignments and fees will appear here.
        </p>
      </div>
      <Button asChild>
        <Link href="/student/teachers">Choose a teacher</Link>
      </Button>
    </div>
  );
}
