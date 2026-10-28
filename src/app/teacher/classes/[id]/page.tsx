"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Archive, Pencil, Users } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getClassById, getClassRoster } from "@/app/teacher/mock/data";
import { ClassTabs } from "@/app/teacher/classes/[id]/class-tabs";

export default function TeacherClassDetailPage() {
  const params = useParams<{ id: string }>();
  const classId = params?.id ?? "";
  const load = useMockPageLoad();
  const [tab, setTab] = React.useState("roster");

  if (load.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-32 animate-pulse rounded-xl bg-secondary" />
        <div className="h-64 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load this class." />;
  }

  const cls = getClassById(classId);

  if (!cls) {
    return (
      <ErrorState
        title="Class not found"
        description="This class is not in your list."
        onRetry={() => window.history.back()}
      />
    );
  }

  const enrolled = getClassRoster(cls.id).length;
  const fillPercent = Math.round((enrolled / cls.capacity) * 100);

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/teacher/classes"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Classes
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{cls.name}</span>
      </nav>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{cls.name}</h2>
              <Badge variant="secondary">{cls.board}</Badge>
              <Badge variant="secondary">{cls.level}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{cls.schedule}</p>
            <div className="mt-3 flex max-w-xs items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, fillPercent)}%` }}
                />
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {enrolled}/{cls.capacity}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setTab("settings")}>
              <Pencil />
              Edit
            </Button>
            <Button type="button" size="sm" variant="outline" className="text-destructive hover:text-destructive">
              <Archive />
              Archive
            </Button>
          </div>
        </div>
      </section>

      <ClassTabs cls={cls} tab={tab} onTabChange={setTab} />
    </div>
  );
}
