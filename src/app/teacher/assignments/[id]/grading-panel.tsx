"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Download, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Submission, TeacherAssignment } from "@/app/teacher/mock/types";
import { formatDateTime, formatFileSize } from "@/lib/format";

interface GradingPanelProps {
  assignment: TeacherAssignment;
  submission: Submission;
  onSave?: (grade: number | null, feedback: string, returned: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * Split grading view: submission on the left, grade + feedback on the right.
 * Cmd/Ctrl+Enter saves and moves to the next submission in the queue.
 */
export function GradingPanel({
  assignment,
  submission,
  onSave,
  onNext,
  onPrevious,
  onClose,
  className,
}: GradingPanelProps) {
  const [grade, setGrade] = React.useState(
    submission.grade !== undefined && submission.grade !== null ? String(submission.grade) : "",
  );
  const [feedback, setFeedback] = React.useState(submission.feedback ?? "");
  const [returned, setReturned] = React.useState(submission.returnedForResubmission ?? false);
  const [saving, setSaving] = React.useState(false);
  const [gradeError, setGradeError] = React.useState<string | null>(null);
  const [savedNote, setSavedNote] = React.useState(false);

  const handleSave = React.useCallback(() => {
    const parsed = grade.trim() === "" ? null : Number(grade);
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0 || parsed > assignment.maxGrade)) {
      setGradeError(`Grade must be between 0 and ${assignment.maxGrade}.`);
      return;
    }
    setGradeError(null);
    setSaving(true);
    // handleSaveGrade — replace with a real API call later.
    window.setTimeout(() => {
      onSave?.(parsed, feedback, returned);
      setSaving(false);
      setSavedNote(true);
      window.setTimeout(() => setSavedNote(false), 1500);
    }, 500);
  }, [grade, feedback, returned, assignment.maxGrade, onSave]);

  const handleSaveAndNext = React.useCallback(() => {
    if (!onNext) {
      handleSave();
      return;
    }
    handleSave();
    onNext();
  }, [handleSave, onNext]);

  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleSaveAndNext();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleSaveAndNext]);

  return (
    <div className={className}>
      <div className="grid gap-4 lg:grid-cols-[60fr_40fr]">
        {/* Left — submission */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Submission</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {submission.studentName} ·{" "}
            {submission.submittedAt ? formatDateTime(submission.submittedAt) : "Not submitted"}
            {submission.status === "late" ? " · marked late" : ""}
          </p>

          {submission.text ? (
            <div className="mt-4 whitespace-pre-wrap rounded-lg border border-border bg-secondary/50 p-4 text-sm leading-relaxed text-foreground">
              {submission.text}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No text answer was provided.</p>
          )}

          {submission.fileName ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {submission.fileName}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {formatFileSize(submission.fileSizeBytes ?? 0)}
                  </span>
                </span>
              </span>
              <Button type="button" variant="outline" size="sm">
                <Download />
                Download
              </Button>
            </div>
          ) : null}
        </section>

        {/* Right — grade + feedback */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Grade &amp; feedback</h3>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="grading-grade">
              Grade (out of {assignment.maxGrade})
            </Label>
            <Input
              id="grading-grade"
              type="number"
              min={0}
              max={assignment.maxGrade}
              value={grade}
              onChange={(event) => {
                setGrade(event.target.value);
                setGradeError(null);
              }}
              placeholder="e.g. 82"
              aria-invalid={gradeError ? true : undefined}
            />
            {gradeError ? (
              <p className="text-xs font-medium text-destructive" role="alert">
                {gradeError}
              </p>
            ) : null}
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="grading-feedback">Feedback to student</Label>
            <Textarea
              id="grading-feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              rows={5}
              placeholder="What went well, what to improve…"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Return for resubmission</p>
              <p className="text-xs text-muted-foreground">
                Student can submit again after your feedback.
              </p>
            </div>
            <Switch checked={returned} onCheckedChange={setReturned} aria-label="Return for resubmission" />
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/85">
        <p className="text-xs text-muted-foreground">
          {savedNote ? "Grade saved (demo)." : "Cmd/Ctrl + Enter = save and next"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {onClose ? (
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
          ) : null}
          {onPrevious ? (
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ChevronLeft />
              Previous
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
          {onNext ? (
            <Button type="button" onClick={handleSaveAndNext} disabled={saving}>
              Save &amp; next
              <ChevronRight />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
