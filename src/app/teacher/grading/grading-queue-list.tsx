"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import {
  getAssignmentById,
  getClassesForTeacher,
  getUngradedSubmissions,
} from "@/app/teacher/mock/data";
import type { Submission } from "@/app/teacher/mock/types";
import { GradingPanel } from "@/app/teacher/assignments/[id]/grading-panel";
import { daysBetween } from "@/lib/date";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function GradingQueueList() {
  const load = useMockPageLoad();
  const [classFilter, setClassFilter] = React.useState("all");
  const [assignmentFilter, setAssignmentFilter] = React.useState("all");
  const [queue, setQueue] = React.useState<Submission[]>(() => getUngradedSubmissions());
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const classes = React.useMemo(() => getClassesForTeacher("current"), []);
  const assignmentOptions = React.useMemo(
    () =>
      Array.from(
        new Map(queue.map((submission) => [submission.assignmentId, getAssignmentById(submission.assignmentId)])).values(),
      ).filter(Boolean),
    [queue],
  );

  const filteredQueue = React.useMemo(() => {
    return queue.filter((submission) => {
      const assignment = getAssignmentById(submission.assignmentId);
      const matchesClass =
        classFilter === "all" ||
        (assignment?.targetType === "class" && assignment.targetId === classFilter) ||
        (assignment?.targetType === "student" && classFilter === "one-on-one");
      const matchesAssignment = assignmentFilter === "all" || submission.assignmentId === assignmentFilter;
      return matchesClass && matchesAssignment;
    });
  }, [queue, classFilter, assignmentFilter]);

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [classFilter, assignmentFilter]);

  const handleSave = (grade: number | null, feedback: string) => {
    const current = filteredQueue[currentIndex];
    if (!current) return;
    // handleSaveGrade — replace with a real API call later.
    setQueue((currentQueue) =>
      currentQueue.filter((submission) => submission.id !== current.id),
    );
  };

  const goNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, Math.max(0, filteredQueue.length - 1)));
  };

  const goPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  if (load.isLoading) {
    return <LoadingSkeleton rows={6} columns={4} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load the grading queue." />;
  }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Header count={0} />
        <EmptyState
          icon={CheckCircle2}
          title="All caught up"
          description="Every submission has been graded. New submissions will appear here."
        />
      </div>
    );
  }

  const current = filteredQueue[currentIndex];
  const currentAssignment = current ? getAssignmentById(current.assignmentId) : undefined;

  return (
    <div className="flex flex-col gap-5">
      <Header count={queue.length} />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[190px]" aria-label="Filter by class">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
            <SelectItem value="one-on-one">One-on-one students</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
          <SelectTrigger className="w-[220px]" aria-label="Filter by assignment">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignments</SelectItem>
            {assignmentOptions.map((assignment) => (
              <SelectItem key={assignment!.id} value={assignment!.id}>
                {assignment!.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">Sorted oldest first.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ul className="divide-y divide-border/70">
          {filteredQueue.map((submission, index) => {
            const waiting = Math.max(0, daysBetween(submission.submittedAt ?? ""));
            const overdue = waiting > 3;
            const assignment = getAssignmentById(submission.assignmentId);
            const isCurrent = current?.id === submission.id;
            return (
              <li key={submission.id}>
                <button
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "flex w-full flex-col gap-2 px-4 py-3.5 text-left transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:gap-4",
                    isCurrent && "bg-accent/40",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {submission.studentName}
                      {overdue ? (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-800 dark:bg-red-950 dark:text-red-300">
                          <AlertTriangle className="h-3 w-3" />
                          {waiting}d waiting
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {assignment?.title} · {assignment?.targetLabel}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(submission.submittedAt ?? "")}
                  </p>
                  <span className="shrink-0">
                    <StatusBadge status={submission.status} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {current && currentAssignment ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Grading — {current.studentName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentIndex + 1} of {filteredQueue.length} in filtered queue
            </p>
          </div>
          <GradingPanel
            assignment={currentAssignment}
            submission={current}
            onSave={handleSave}
            onNext={goNext}
            onPrevious={currentIndex > 0 ? goPrevious : undefined}
          />
        </section>
      ) : null}
    </div>
  );
}

function Header({ count }: { count: number }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Grading queue</h2>
      <p className="text-sm text-muted-foreground">
        {count === 0 ? "Nothing waiting." : (
          <>
            <span className="font-semibold text-foreground">{count}</span> left to grade — oldest
            submissions first.
          </>
        )}
      </p>
    </div>
  );
}
