import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this list right now. Please try again in a moment.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50/60 px-6 py-16 text-center dark:border-red-900/60 dark:bg-red-950/30",
        className
      )}
      role="alert"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {onRetry ? (
        <Button type="button" onClick={onRetry} variant="outline">
          <RotateCcw />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
