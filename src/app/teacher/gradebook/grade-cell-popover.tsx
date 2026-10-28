"use client";

import * as React from "react";
import { Check, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { GradebookCell, GradebookColumn } from "@/app/teacher/mock/types";

interface GradeCellPopoverProps {
  cell: GradebookCell;
  column: GradebookColumn;
  studentName: string;
  onSave: (assignmentId: string, studentId: string, value: number | null, feedback: string) => void;
}

export function GradeCellPopover({ cell, column, studentName, onSave }: GradeCellPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(cell.value !== null ? String(cell.value) : "");
  const [feedback, setFeedback] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setValue(cell.value !== null ? String(cell.value) : "");
      setFeedback("");
      setError(null);
    }
  }, [open, cell.value]);

  const handleSave = () => {
    if (value.trim() === "") {
      onSave(column.assignmentId, cell.studentId, null, feedback);
      setOpen(false);
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > column.maxGrade) {
      setError(`Grade must be between 0 and ${column.maxGrade}.`);
      return;
    }
    setSaving(true);
    // handleSaveGradebookCell — replace with a real API call later.
    window.setTimeout(() => {
      setSaving(false);
      onSave(column.assignmentId, cell.studentId, parsed, feedback);
      setOpen(false);
    }, 400);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="mx-auto flex h-8 w-14 items-center justify-center gap-1 rounded-md text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          aria-label={`Grade for ${studentName}, ${column.title}: ${cell.value !== null ? cell.value : "not graded"}`}
        >
          {cell.value !== null ? cell.value : <span className="text-muted-foreground">–</span>}
          {cell.late ? <Flag className="h-3 w-3 text-amber-600" /> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">{studentName}</p>
            <p className="text-xs text-muted-foreground">{column.title}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`grade-${cell.studentId}-${column.assignmentId}`}>
              Grade (0–{column.maxGrade})
            </Label>
            <Input
              id={`grade-${cell.studentId}-${column.assignmentId}`}
              type="number"
              min={0}
              max={column.maxGrade}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setError(null);
              }}
              aria-invalid={error ? true : undefined}
            />
            {error ? (
              <p className="text-xs font-medium text-destructive" role="alert">{error}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`feedback-${cell.studentId}-${column.assignmentId}`}>
              Feedback (optional)
            </Label>
            <Textarea
              id={`feedback-${cell.studentId}-${column.assignmentId}`}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              rows={2}
            />
          </div>
          <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
            <Check />
            {saving ? "Saving…" : "Save grade"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
