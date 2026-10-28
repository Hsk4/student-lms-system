"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getStudentById } from "@/app/teacher/mock/data";
import { StudentHeaderCard } from "@/app/teacher/students/[id]/student-header-card";
import { StudentTabs } from "@/app/teacher/students/[id]/student-tabs";

export default function TeacherStudentDetailPage() {
  const params = useParams<{ id: string }>();
  const studentId = params?.id ?? "";
  const load = useMockPageLoad();

  if (load.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-40 animate-pulse rounded-xl bg-secondary" />
        <div className="h-10 w-72 animate-pulse rounded-lg bg-secondary" />
        <div className="h-64 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load this student." />;
  }

  const student = getStudentById(studentId);

  if (!student) {
    return (
      <ErrorState
        title="Student not found"
        description="This student is not in your list."
        onRetry={() => window.history.back()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/teacher/students"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          My Students
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{student.name}</span>
      </nav>

      <StudentHeaderCard student={student} />
      <StudentTabs studentId={studentId} />
    </div>
  );
}
