"use client";

import * as React from "react";
import { FileText, Film, Link2, Loader2, Presentation, Sheet, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getClassesForTeacher, getStudentsForTeacher } from "@/app/teacher/mock/data";

interface UploadMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded?: (title: string) => void;
}

export function UploadMaterialDialog({ open, onOpenChange, onUploaded }: UploadMaterialDialogProps) {
  const classes = React.useMemo(() => getClassesForTeacher(), []);
  const students = React.useMemo(() => getStudentsForTeacher().filter((s) => s.status === "active"), []);

  const [title, setTitle] = React.useState("");
  const [targetId, setTargetId] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [errors, setErrors] = React.useState<{ title?: string; target?: string; file?: string }>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle("");
      setTargetId("");
      setDescription("");
      setFileName(null);
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (title.trim().length < 3) nextErrors.title = "Give the material a title.";
    if (!targetId) nextErrors.target = "Choose a class or student.";
    if (!fileName) nextErrors.file = "Pick a file to upload.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // handleUploadMaterial — replace with a real API call later.
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onUploaded?.(title.trim());
      onOpenChange(false);
    }, 900);
  };

  const targetOptions = [
    ...classes.map((cls) => ({ value: cls.id, label: `Class — ${cls.name}` })),
    ...students.map((student) => ({ value: student.id, label: `One-on-one — ${student.name}` })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Upload material</DialogTitle>
            <DialogDescription>
              Share worksheets, notes or recordings with a class or student.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                const name = event.dataTransfer.files?.[0]?.name;
                if (name) {
                  setFileName(name);
                  setErrors((current) => ({ ...current, file: undefined }));
                }
              }}
              className={
                dragOver
                  ? "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-primary bg-accent/50 px-4 py-8 text-center"
                  : "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-4 py-8 text-center transition-colors hover:bg-secondary"
              }
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {fileName ? (
                  <span className="font-medium text-foreground">{fileName}</span>
                ) : (
                  "Drag a file here or click to browse"
                )}
              </p>
              <input
                type="file"
                className="sr-only"
                onChange={(event) => {
                  const name = event.target.files?.[0]?.name;
                  if (name) {
                    setFileName(name);
                    setErrors((current) => ({ ...current, file: undefined }));
                  }
                }}
              />
            </div>
            {errors.file ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.file}</p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="material-title">Title</Label>
              <Input
                id="material-title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setErrors((current) => ({ ...current, title: undefined }));
                }}
                placeholder="e.g. Triangles worksheet pack"
                aria-invalid={errors.title ? true : undefined}
              />
              {errors.title ? (
                <p className="text-xs font-medium text-destructive" role="alert">{errors.title}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Target class / student</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger aria-label="Target">
                  <SelectValue placeholder="Choose target…" />
                </SelectTrigger>
                <SelectContent>
                  {targetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.target ? (
                <p className="text-xs font-medium text-destructive" role="alert">{errors.target}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="material-description">Description (optional)</Label>
              <Textarea
                id="material-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={2}
                placeholder="What is this material for?"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const MATERIAL_TYPE_ICON = {
  pdf: FileText,
  worksheet: Sheet,
  slides: Presentation,
  video: Film,
  link: Link2,
} as const;
