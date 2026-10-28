"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import {
  QUIZ_RESULT_KEY,
  QUIZ_QUESTIONS,
  type QuizQuestion,
} from "@/app/student/quizzes/quiz-history-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuizResultState {
  questions: QuizQuestion[];
  selections: Record<number, number>;
}

function readStoredResult(): QuizResultState | null {
  try {
    const raw = window.sessionStorage.getItem(QUIZ_RESULT_KEY);
    if (!raw) return null;
    return window.JSON.parse(raw) as QuizResultState;
  } catch {
    return null;
  }
}

function demoResult(): QuizResultState {
  return {
    questions: QUIZ_QUESTIONS,
    selections: { 0: 0, 1: 1, 2: 0, 3: 2, 4: 0 },
  };
}

export default function QuizResultPage() {
  const [isReady, setIsReady] = React.useState(false);
  const [result, setResult] = React.useState<QuizResultState | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setResult(readStoredResult());
      setIsReady(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const state = result ?? demoResult();
  const isDemo = result === null;

  const score = state.questions.reduce(
    (sum, question, index) =>
      state.selections[index] === question.correctIndex ? sum + 1 : sum,
    0,
  );
  const total = state.questions.length;
  const percent = Math.round((score / total) * 100);

  const message =
    percent === 100
      ? "Perfect score — excellent work!"
      : percent >= 80
        ? "Strong result. A quick revision of the missed ones and you are ready."
        : percent >= 60
          ? "Good effort. Review the explanations below and try another quiz."
          : "Keep practising. Revisit the material and try again.";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Quiz result
          </h2>
          <p className="text-sm text-muted-foreground">
            {isDemo
              ? "No fresh result found, so a sample review is shown."
              : "Here is how you did, question by question."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/student/quizzes">
            <RotateCcw />
            New quiz
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Score</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          {score}/{total}
        </p>
        <Badge
          variant={percent >= 80 ? "success" : percent >= 60 ? "warning" : "destructive"}
          className="mt-2"
        >
          {percent}%
        </Badge>
        <p className="mt-3 mx-auto max-w-md text-sm text-muted-foreground">
          {message}
        </p>
        <Button asChild className="mt-4">
          <Link href="/student/quizzes">Try another quiz</Link>
        </Button>
      </div>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-foreground">Review</h3>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {state.questions.map((question, index) => {
            const chosen = state.selections[index];
            const isCorrect = chosen === question.correctIndex;
            return (
              <div
                key={question.prompt}
                className="border-b border-border/70 px-4 py-4 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {index + 1}. {question.prompt}
                  </p>
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="mt-2 flex flex-col gap-1 text-xs">
                  <span className="text-muted-foreground">
                    Correct answer:{" "}
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">
                      {question.options[question.correctIndex]}
                    </span>
                  </span>
                  {!isCorrect ? (
                    <span className="text-muted-foreground">
                      Your answer:{" "}
                      <span className="font-medium text-red-700 dark:text-red-300">
                        {chosen !== undefined
                          ? question.options[chosen]
                          : "Not answered"}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      You answered{" "}
                      <span className="font-medium text-emerald-700 dark:text-emerald-300">
                        {question.options[chosen]}
                      </span>
                      — correct
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    "mt-2 h-1 w-full overflow-hidden rounded-full",
                    isCorrect ? "bg-emerald-100 dark:bg-emerald-950" : "bg-red-100 dark:bg-red-950",
                  )}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
