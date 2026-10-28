"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Pencil, XCircle } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getAssignmentById, getSubmissionsForAssignment } from "@/app/teacher/mock/data";
import type { Submission } from "@/app/teacher/mock/types";
import { GradingPanel } from "@/app/teacher/assignments/[id]/grading-panel";
import { SubmissionsTable } from "@/app/teacher/assignments/[id]/submissions-table";
import { formatDateOnly } from "@/lib/format";

export default function AssignmentDetailPage() {
  const params = useParams<{ id: string }>();
  const assignmentId = params?.id ?? "";
  const router = useRouter();
  const load = useMockPageLoad();
  const [filter, setFilter] = React.useState("all");
  const [gradingId, setGradingId] = React.useState<string | null>(null);
  const [gradedLocally, setGradedLocally] = React.useState<Record<string, { grade: number | null; feedback: string }>>({});
  const [reminded, setReminded] = React.useState<string[]>([]);

  if (load.isLoading) {
    return <LoadingSkeleton rows={6} columns={5} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load this assignment." />;
  }

  const assignment = getAssignmentById(assignmentId);

  if (!assignment) {
    return (
      <ErrorState
        title="Assignment not found"
        description="This assignment is not in your list."
        onRetry={() => router.push("/teacher/assignments")}
      />
    );
  }

  const baseSubmissions = getSubmissionsForAssignment(assignment.id);
  const submissions: Submission[] = baseSubmissions.map((submission) => {
    const local = gradedLocally[submission.id];
    return local
      ? { ...submission, grade: local.grade ?? submission.grade, feedback: local.feedback, status: local.grade !== null ? "graded" : submission.status }
      : submission;
  });

  const submittedCount = submissions.filter((row) => row.submittedAt).length;
  const missingCount = submissions.filter((row) => row.status === "missing").length;
  const gradedCount = submissions.filter((row) => row.status === "graded").length;

  const gradingIndex = submissions.findIndex((row) => row.id === gradingId);
  const grading = gradingIndex >= 0 ? submissions[gradingIndex] : null;
  const gradeableQueue = submissions.filter((row) => row.submittedAt);

  const handleSaveGrade = (grade: number | null, feedback: string) => {
    if (!grading) return;
    setGradedLocally((current) => ({ ...current, [grading.id]: { grade, feedback } }));
  };

  const goNext = () => {
    const currentIndex = gradeableQueue.findIndex((row) => row.id === gradingId);
    const next = gradeableQueue[currentIndex + 1];
    setGradingId(next ? next.id : null);
  };

  const goPrevious = () => {
    const currentIndex = gradeableQueue.findIndex((row) => row.id === gradingId);
    const previous = gradeableQueue[currentIndex - 1];
    if (previous) setGradingId(previous.id);
  };

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/teacher/assignments"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Assignments
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{assignment.title}</span>
      </nav>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {assignment.title}
              </h2>
              <StatusBadge status={assignment.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {assignment.targetLabel} · Due {formatDateOnly(assignment.dueDate)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="accent">Submitted {submittedCount}</Badge>
              <Badge variant="warning">Missing {missingCount}</Badge>
              <Badge variant="success">Graded {gradedCount}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/teacher/assignments/${assignment.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            <Button type="button" size="sm" variant="outline" className="text-destructive hover:text-destructive">
              <XCircle />
              Close
            </Button>
          </div>
        </div>
      </section>

      <SubmissionsTable
        submissions={submissions}
        maxGrade={assignment.maxGrade}
        filter={filter}
        onFilterChange={setFilter}
        onGrade={(submission) => setGradingId(submission.id)}
        onRemind={(submission) => setReminded((current) => [...current, submission.id])}
      />

      {reminded.length > 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Check className="h-4 w-4 text-emerald-600" />
          Reminder sent to {reminded.length} student(s) — demo only.
        </p>
      ) : null}

      {grading ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Grading — {grading.studentName}
            </h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => setGradingId(null)}>
              Close panel
            </Button>
          </div>
          <GradingPanel
            assignment={assignment}
            submission={grading}
            onSave={handleSaveGrade}
            onNext={gradingIndex < gradeableQueue.length - 1 ? goNext : undefined}
            onPrevious={gradingIndex > 0 ? goPrevious : undefined}
          />
        </section>
      ) : null}
    </div>
  );
}
