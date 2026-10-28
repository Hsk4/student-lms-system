"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FilePlus2, Loader2, Lock, Paperclip, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClassesForTeacher, getStudentsForTeacher } from "@/app/teacher/mock/data";
import type { TeacherAssignment } from "@/app/teacher/mock/types";

interface AssignmentFormProps {
  /** Existing assignment in edit mode; undefined for create. */
  assignment?: TeacherAssignment;
  /** Edit mode locks target + max grade once submissions exist. */
  hasSubmissions?: boolean;
}

interface TargetOption {
  value: string;
  label: string;
  count: number;
}

export function AssignmentForm({ assignment, hasSubmissions = false }: AssignmentFormProps) {
  const router = useRouter();
  const isEdit = Boolean(assignment);

  const [title, setTitle] = React.useState(assignment?.title ?? "");
  const [description, setDescription] = React.useState(assignment?.description ?? "");
  const [targetId, setTargetId] = React.useState(
    assignment ? `${assignment.targetType}:${assignment.targetId}` : "",
  );
  const [dueDate, setDueDate] = React.useState(
    assignment ? assignment.dueDate.slice(0, 10) : "",
  );
  const [dueTime, setDueTime] = React.useState(
    assignment ? assignment.dueDate.slice(11, 16) : "22:00",
  );
  const [maxGrade, setMaxGrade] = React.useState(String(assignment?.maxGrade ?? 100));
  const [allowLate, setAllowLate] = React.useState(assignment?.allowLate ?? true);
  const [latePenalty, setLatePenalty] = React.useState(String(assignment?.latePenaltyPercent ?? 5));
  const [attachments, setAttachments] = React.useState<string[]>(
    assignment?.attachments.map((item) => item.fileName) ?? [],
  );
  const [errors, setErrors] = React.useState<{
    title?: string;
    description?: string;
    target?: string;
    dueDate?: string;
    maxGrade?: string;
  }>({});
  const [busy, setBusy] = React.useState<"draft" | "publish" | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const classes = React.useMemo(() => getClassesForTeacher("current"), []);
  const students = React.useMemo(() => getStudentsForTeacher().filter((s) => s.status === "active"), []);

  const targetOptions = React.useMemo<TargetOption[]>(
    () => [
      ...classes.map((cls) => ({
        value: `class:${cls.id}`,
        label: `Class — ${cls.name}`,
        count: Math.min(cls.capacity, 20),
      })),
      ...students.map((student) => ({
        value: `student:${student.id}`,
        label: `One-on-one — ${student.name}`,
        count: 1,
      })),
    ],
    [classes, students],
  );

  const selectedTarget = targetOptions.find((option) => option.value === targetId);

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (title.trim().length < 4) nextErrors.title = "Give the assignment a clear title.";
    if (description.trim().length < 10) nextErrors.description = "Add instructions (min 10 characters).";
    if (!targetId) nextErrors.target = "Choose a class or student.";
    if (!dueDate) nextErrors.dueDate = "Pick a due date.";
    const max = Number(maxGrade);
    if (!maxGrade || Number.isNaN(max) || max < 1 || max > 1000) {
      nextErrors.maxGrade = "Maximum grade must be between 1 and 1000.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const runSubmit = (mode: "draft" | "publish") => {
    // handleSaveDraft / handlePublishAssignment — replace with a real API call later.
    setBusy(mode);
    window.setTimeout(() => {
      setBusy(null);
      setConfirmOpen(false);
      router.push("/teacher/assignments");
    }, 800);
  };

  const handleSaveDraft = () => {
    if (!validate()) return;
    runSubmit("draft");
  };

  const handlePublishClick = () => {
    if (!validate()) return;
    setConfirmOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <form
        noValidate
        className="flex w-full max-w-[720px] flex-col gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-1.5">
            <Label htmlFor="assignment-title">Title</Label>
            <Input
              id="assignment-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrors((current) => ({ ...current, title: undefined }));
              }}
              placeholder="e.g. Triangles problem set"
              aria-invalid={errors.title ? true : undefined}
            />
            {errors.title ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.title}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="assignment-description">Description / instructions</Label>
            <div
              className="min-h-[140px] rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-ring"
              role="textbox"
              aria-multiline="true"
              tabIndex={0}
              aria-label="Description"
            >
              <div className="flex gap-1 border-b border-border px-2 py-1.5">
                {["Bold", "Italic", "Bullets", "Numbered"].map((tool) => (
                  <span
                    key={tool}
                    className="rounded px-2 py-0.5 text-xs text-muted-foreground"
                    title={`${tool} (UI only)`}
                  >
                    {tool === "Bold" ? <strong>B</strong> : tool === "Italic" ? <em>I</em> : tool === "Bullets" ? "•" : "1."}
                  </span>
                ))}
              </div>
              <Textarea
                id="assignment-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrors((current) => ({ ...current, description: undefined }));
                }}
                className="min-h-[96px] resize-y border-0 focus-visible:ring-0"
                placeholder="Instructions for the student…"
                aria-invalid={errors.description ? true : undefined}
              />
            </div>
            {errors.description ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.description}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label>Target</Label>
            {isEdit && hasSubmissions ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2.5 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  {assignment?.targetLabel}
                </div>
                <p className="text-xs text-muted-foreground">
                  Locked — students have already been notified of this target.
                </p>
              </>
            ) : (
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger aria-label="Target">
                  <SelectValue placeholder="Choose a class or student" />
                </SelectTrigger>
                <SelectContent>
                  {targetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.target ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.target}</p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="assignment-due-date">Due date</Label>
              <Input
                id="assignment-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  setErrors((current) => ({ ...current, dueDate: undefined }));
                }}
                aria-invalid={errors.dueDate ? true : undefined}
              />
              {errors.dueDate ? (
                <p className="text-xs font-medium text-destructive" role="alert">{errors.dueDate}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignment-due-time">Due time</Label>
              <Input
                id="assignment-due-time"
                type="time"
                value={dueTime}
                onChange={(event) => setDueTime(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="assignment-max-grade">Maximum grade</Label>
            {isEdit && hasSubmissions ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2.5 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  {assignment?.maxGrade} points
                </div>
                <p className="text-xs text-muted-foreground">
                  Locked — changing the maximum would invalidate existing grades.
                </p>
              </>
            ) : (
              <>
                <Input
                  id="assignment-max-grade"
                  type="number"
                  min={1}
                  max={1000}
                  value={maxGrade}
                  onChange={(event) => {
                    setMaxGrade(event.target.value);
                    setErrors((current) => ({ ...current, maxGrade: undefined }));
                  }}
                  aria-invalid={errors.maxGrade ? true : undefined}
                />
                {errors.maxGrade ? (
                  <p className="text-xs font-medium text-destructive" role="alert">{errors.maxGrade}</p>
                ) : null}
              </>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Attachments</Label>
            {attachments.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {attachments.map((fileName) => (
                  <li
                    key={fileName}
                    className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    {fileName}
                  </li>
                ))}
              </ul>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-secondary">
                <FilePlus2 className="h-4 w-4" />
                Drag a file here or click to browse (UI only)
                <input
                  type="file"
                  className="sr-only"
                  onChange={(event) => {
                    const name = event.target.files?.[0]?.name;
                    if (name) setAttachments((current) => [...current, name]);
                  }}
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Allow late submissions</p>
              <p className="text-xs text-muted-foreground">Students can submit after the due time.</p>
            </div>
            <Switch checked={allowLate} onCheckedChange={setAllowLate} aria-label="Allow late submissions" />
          </div>

          {allowLate ? (
            <div className="space-y-1.5">
              <Label htmlFor="assignment-late-penalty">Late penalty (%)</Label>
              <Input
                id="assignment-late-penalty"
                type="number"
                min={0}
                max={100}
                value={latePenalty}
                onChange={(event) => setLatePenalty(event.target.value)}
              />
            </div>
          ) : null}
        </div>

        {/* Sticky footer actions */}
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/85">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={busy !== null}>
            {busy === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save />}
            {busy === "draft" ? "Saving…" : "Save draft"}
          </Button>
          <Button type="button" onClick={handlePublishClick} disabled={busy !== null}>
            {busy === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
            {busy === "publish" ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </form>

      {/* Summary panel */}
      <aside className="w-full shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:w-72">
        <h3 className="text-sm font-semibold text-foreground">Summary</h3>
        <dl className="mt-3 flex flex-col gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Target</dt>
            <dd className="font-medium text-foreground">
              {selectedTarget?.label ?? "Not selected"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Students to be notified</dt>
            <dd className="font-medium text-foreground">{selectedTarget?.count ?? 0}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Due</dt>
            <dd className="font-medium text-foreground">
              {dueDate ? `${dueDate} ${dueTime}` : "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Status</dt>
            <dd className="font-medium text-foreground">
              {isEdit ? "Published" : "New draft"}
            </dd>
          </div>
        </dl>
      </aside>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Publish assignment?</DialogTitle>
            <DialogDescription>
              {selectedTarget?.count ?? 0} student(s) will be notified about{" "}
              <span className="font-medium text-foreground">{title}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              Not yet
            </Button>
            <Button type="button" onClick={() => runSubmit("publish")} disabled={busy !== null}>
              {busy === "publish" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
