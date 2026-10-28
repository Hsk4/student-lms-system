"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  QUIZ_QUESTIONS,
  QUIZ_RESULT_KEY,
  type QuizQuestion,
} from "@/app/student/quizzes/quiz-history-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuizResultState {
  questions: QuizQuestion[];
  selections: Record<number, number>;
}

export default function QuizTakePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Practice quiz
        </h2>
        <p className="text-sm text-muted-foreground">
          One question at a time. You can go back to change an answer.
        </p>
      </div>
      <QuizTakeFlow />
    </div>
  );
}

function QuizTakeFlow() {
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selections, setSelections] = React.useState<Record<number, number>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const questions = QUIZ_QUESTIONS;
  const questionCount = questions.length;

  if (!isReady) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  const question = questions[questionIndex] as QuizQuestion | undefined;

  if (!question) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          This quiz ran out of questions. Head back and start a new one.
        </p>
        <Button asChild variant="outline" className="mt-3">
          <Link href="/student/quizzes">Back to quizzes</Link>
        </Button>
      </div>
    );
  }

  const selected = selections[questionIndex];

  const chooseOption = (optionIndex: number) => {
    setSelections((current) => ({ ...current, [questionIndex]: optionIndex }));
  };

  const goNext = () => {
    if (questionIndex < questionCount - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const submitQuiz = () => {
    setIsSubmitting(true);
    const result: QuizResultState = { questions, selections };
    try {
      window.sessionStorage.setItem(
        QUIZ_RESULT_KEY,
        window.JSON.stringify(result),
      );
    } catch {
      void 0;
    }
    window.setTimeout(() => router.push("/student/quizzes/result"), 400);
  };

  const isLastQuestion = questionIndex === questionCount - 1;
  const canAdvance = selected !== undefined;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          Question {questionIndex + 1} of {questionCount}
        </p>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {questions.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                index === questionIndex
                  ? "bg-primary"
                  : selections[index] !== undefined
                    ? "bg-primary/40"
                    : "bg-border",
              )}
            />
          ))}
        </div>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={questionIndex + 1}
        aria-valuemin={1}
        aria-valuemax={questionCount}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((questionIndex + 1) / questionCount) * 100}%` }}
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
        {question.prompt}
      </h3>

      <div className="mt-4 grid gap-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => chooseOption(optionIndex)}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150",
                isSelected
                  ? "border-primary bg-accent text-accent-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              <span className="pr-3">{option}</span>
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  isSelected ? "border-primary bg-primary" : "border-border",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={questionIndex === 0}
        >
          <ArrowLeft />
          Back
        </Button>

        {isLastQuestion ? (
          <Button
            type="button"
            onClick={submitQuiz}
            disabled={!canAdvance || isSubmitting}
          >
            {isSubmitting ? "Checking..." : "Submit answers"}
          </Button>
        ) : (
          <Button type="button" onClick={goNext} disabled={!canAdvance}>
            Next
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
