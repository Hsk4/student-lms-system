"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getAssignmentById, getSubmissionsForAssignment } from "@/app/teacher/mock/data";
import { AssignmentForm } from "@/app/teacher/assignments/assignment-form";

export default function EditAssignmentPage() {
  const params = useParams<{ id: string }>();
  const assignmentId = params?.id ?? "";
  const router = useRouter();
  const load = useMockPageLoad();

  if (load.isLoading) {
    return <LoadingSkeleton rows={6} columns={3} />;
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

  const hasSubmissions = getSubmissionsForAssignment(assignment.id).some(
    (submission) => submission.submittedAt,
  );

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href={`/teacher/assignments/${assignment.id}`}
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {assignment.title}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium text-foreground">Edit</span>
      </nav>

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Edit assignment</h2>
        <p className="text-sm text-muted-foreground">
          {hasSubmissions
            ? "Submissions already exist, so the target and maximum grade are locked."
            : "Update details — nothing has been submitted yet."}
        </p>
      </div>

      <AssignmentForm assignment={assignment} hasSubmissions={hasSubmissions} />
    </div>
  );
}
