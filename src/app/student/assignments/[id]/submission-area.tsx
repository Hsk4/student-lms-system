"use client";

import * as React from "react";
import { CheckCircle2, FileText, Lock, Send } from "lucide-react";

import {
  FileUploadZone,
} from "@/app/student/assignments/[id]/file-upload-zone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, formatFileSize } from "@/lib/format";

export interface AssignmentSubmission {
  note: string;
  fileName: string | null;
  fileSize: number | null;
  submittedAt: string;
}

interface SubmissionAreaProps {
  teacher: string;
  locked: boolean;
  submission: AssignmentSubmission | null;
  onSubmit: (submission: AssignmentSubmission) => void;
  formRef?: React.RefObject<HTMLFormElement>;
}

function placeholderFor(teacher: string): string {
  return `Write a short message for ${teacher}...`;
}

export function SubmissionArea({
  teacher,
  locked,
  submission,
  onSubmit,
  formRef,
}: SubmissionAreaProps) {
  const [note, setNote] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = () => {
    if (!note.trim() && !file) {
      setError("Add a note or attach a file before submitting.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    window.setTimeout(() => {
      onSubmit({
        note: note.trim(),
        fileName: file?.name ?? null,
        fileSize: file?.size ?? null,
        submittedAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
      setNote("");
      setFile(null);
    }, 900);
  };

  if (submission) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold text-foreground">
            Submitted {formatDateTime(submission.submittedAt)}
          </p>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Your note
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
          {submission.note || "No note attached."}
        </p>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Attached file
        </p>
        {submission.fileName ? (
          <span className="mt-1 flex items-center gap-2 text-sm text-foreground">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {submission.fileName}
            <span className="text-xs text-muted-foreground">
              ({formatFileSize(submission.fileSize ?? 0)})
            </span>
          </span>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">No file attached.</p>
        )}

        {locked ? (
          <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Resubmission is not available yet. Ask your teacher if you need to
            edit this.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-foreground">Submit your work</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Write a short summary and attach any files for {teacher}.
      </p>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="submission-note">Note for your teacher</Label>
          <Textarea
            id="submission-note"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setError(null);
            }}
            placeholder={placeholderFor(teacher)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>Attachment (optional)</Label>
          <FileUploadZone file={file} onChange={setFile} disabled={isSubmitting} />
        </div>

        {error ? (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <div className="hidden sm:block">
          <Button type="submit" disabled={isSubmitting}>
            <Send />
            {isSubmitting ? "Submitting..." : "Submit assignment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
