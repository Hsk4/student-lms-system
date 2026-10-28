"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarClock, GraduationCap } from "lucide-react";

import {
  MOCK_STUDENT_COURSES,
  type StudentCourse,
} from "@/app/student/courses/courses-list";
import { OverviewTab } from "@/app/student/courses/[id]/overview-tab";
import { CourseAssignmentsTab } from "@/app/student/courses/[id]/assignments-tab";
import { MaterialsTab } from "@/app/student/courses/[id]/materials-tab";
import { AttendanceTab } from "@/app/student/courses/[id]/attendance-tab";
import { GradesTab } from "@/app/student/courses/[id]/grades-tab";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { formatDateOnly } from "@/lib/format";

const TAB_VALUES = ["overview", "assignments", "materials", "attendance", "grades"] as const;
type TabValue = (typeof TAB_VALUES)[number];

const TAB_META: { value: TabValue; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "assignments", label: "Assignments" },
  { value: "materials", label: "Materials" },
  { value: "attendance", label: "Attendance" },
  { value: "grades", label: "Grades" },
];

interface CourseTabsProps {
  courseId: string;
}

export function CourseTabs({ courseId }: CourseTabsProps) {
  const controller = useMockPageLoad();
  const [tab, setTab] = React.useState<TabValue>("overview");

  const course: StudentCourse | undefined = MOCK_STUDENT_COURSES.find(
    (item) => item.id === courseId,
  );

  if (controller.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <div className="space-y-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/student/courses">
            <ArrowLeft />
            Back to courses
          </Link>
        </Button>
        <ErrorState onRetry={controller.retry} />
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="This course does not exist or may have ended. Go back to your course list."
        icon={GraduationCap}
        action={
          <Button asChild variant="outline">
            <Link href="/student/courses">Back to courses</Link>
          </Button>
        }
      />
    );
  }

  const nextClassLabel = course.nextClass
    ? formatDateOnly(course.nextClass)
    : "Not scheduled";

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/student/courses">
          <ArrowLeft />
          Back to courses
        </Link>
      </Button>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {course.subject} · {course.level}
            </h2>
            <p className="text-sm text-muted-foreground">
              With {course.teacher} · {course.board} board
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={course.status} />
            <Badge variant="secondary">{course.mode}</Badge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            {course.schedule}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            Next class: {nextClassLabel}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            Started {formatDateOnly(course.started)}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Assignments</span>
            <span>
              {course.assignmentsDone} of {course.assignmentsTotal} done
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (course.assignmentsDone / Math.max(1, course.assignmentsTotal)) *
                    100,
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)}>
        <div className="overflow-x-auto pb-1 max-sm:-mx-4 max-sm:px-4">
          <TabsList className="inline-flex min-w-full max-sm:w-full">
            {TAB_META.map((meta) => (
              <TabsTrigger key={meta.value} value={meta.value}>
                {meta.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tab === "overview" ? <OverviewTab course={course} /> : null}
        {tab === "assignments" ? <CourseAssignmentsTab course={course} /> : null}
        {tab === "materials" ? <MaterialsTab course={course} /> : null}
        {tab === "attendance" ? <AttendanceTab course={course} /> : null}
        {tab === "grades" ? <GradesTab course={course} /> : null}
      </Tabs>
    </div>
  );
}
