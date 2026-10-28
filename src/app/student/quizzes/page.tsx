"use client";

import * as React from "react";
import { Flag, FlaskConical } from "lucide-react";

import {
  MOCK_QUIZ_HISTORY,
  QuizHistoryTable,
} from "@/app/student/quizzes/quiz-history-table";
import { NewQuizDialog } from "@/app/student/quizzes/new-quiz-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";

export default function QuizzesPage() {
  const controller = useMockPageLoad();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (controller.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Quizzes
          </h2>
          <p className="text-sm text-muted-foreground">
            Practice quizzes for your enrolled courses.
          </p>
        </div>
        <ErrorState onRetry={controller.retry} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground shadow-sm">
        <span className="mr-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground rounded-full bg-accent px-2 py-0.5">
          <Flag className="h-3 w-3" />
          F7 preview
        </span>
        Quizzes are behind a feature flag. They are hidden in the sidebar
        until the flag is enabled.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Quizzes
          </h2>
          <p className="text-sm text-muted-foreground">
            Past practice quizzes for your enrolled courses.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => setDialogOpen(true)}
          >
            <FlaskConical />
            New quiz
          </Button>
        </div>
      </div>

      <QuizHistoryTable rows={MOCK_QUIZ_HISTORY} />

      <NewQuizDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
