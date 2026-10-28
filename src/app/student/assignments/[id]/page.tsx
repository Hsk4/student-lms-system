"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Bug, GraduationCap, Unlock } from "lucide-react";

import {
  MOCK_STUDENT_ASSIGNMENTS,
  type StudentAssignment,
} from "@/app/student/assignments/assignments-table";
import {
  SubmissionArea,
  type AssignmentSubmission,
} from "@/app/student/assignments/[id]/submission-area";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { formatDateTime } from "@/lib/format";

export default function AssignmentDetailPage() {
  const params = useParams<{ id: string }>();
  const controller = useMockPageLoad();

  const assignment: StudentAssignment | undefined =
    MOCK_STUDENT_ASSIGNMENTS.find((item) => item.id === params?.id);

  const [submission, setSubmission] = React.useState<
    AssignmentSubmission | null
  >(assignment?.submission ?? null);
  const [allowResubmission, setAllowResubmission] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    setSubmission(assignment?.submission ?? null);
    setAllowResubmission(false);
  }, [assignment?.id, assignment?.submission]);

  if (controller.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return <ErrorState onRetry={controller.retry} />;
  }

  if (!assignment) {
    return (
      <EmptyState
        title="Assignment not found"
        description="This assignment does not exist or may have been removed."
        icon={GraduationCap}
        action={
          <Button asChild variant="outline">
            <Link href="/student/assignments">Back to assignments</Link>
          </Button>
        }
      />
    );
  }

  const isGraded = assignment.status === "graded";
  const editable = !isGraded && (submission === null || allowResubmission);
  const locked = !editable;

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/student/assignments">
          <ArrowLeft />
          Back to assignments
        </Link>
      </Button>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {assignment.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {assignment.course} · {assignment.teacher}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="outline">
              Due {formatDateTime(assignment.dueDate)}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={assignment.status} />
          {isGraded && assignment.score !== undefined && assignment.maxScore ? (
            <Badge variant="accent">
              Score {assignment.score}/{assignment.maxScore}
            </Badge>
          ) : null}
          {assignment.status === "submitted" ? (
            <Button
              type="button"
              variant={allowResubmission ? "destructive" : "outline"}
              size="sm"
              onClick={() => setAllowResubmission(!allowResubmission)}
              title="Dev toggle: allow editing the submission"
            >
              <Unlock />
              Allow resubmission
            </Button>
          ) : null}
          <Button
            type="button"
            variant={controller.simulateError ? "destructive" : "outline"}
            size="sm"
            onClick={() =>
              controller.setSimulateError(!controller.simulateError)
            }
            title="Dev toggle: simulate a failed request"
          >
            <Bug />
            Simulate error
          </Button>
        </div>
      </div>

      {isGraded && assignment.feedback ? (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Teacher feedback
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {assignment.feedback}
          </p>
          <p className="mt-2 text-sm text-foreground">
            Score:{" "}
            <span className="font-semibold tabular-nums">
              {assignment.score}/{assignment.maxScore}
            </span>
          </p>
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Teacher instructions
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          {assignment.instructions}
        </p>
      </div>

      {isGraded ? (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            This assignment is graded. No further submission is possible.
          </p>
        </div>
      ) : (
        <SubmissionArea
          teacher={assignment.teacher}
          locked={locked}
          submission={submission}
          formRef={formRef}
          onSubmit={(next) => {
            setSubmission(next);
            setAllowResubmission(false);
          }}
        />
      )}

      {editable ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur sm:hidden">
          <div className="mx-auto w-full max-w-[1100px]">
            <Button
              type="button"
              className="w-full"
              onClick={() => formRef.current?.requestSubmit()}
            >
              Submit
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
