"use client";

import * as React from "react";
import { Send } from "lucide-react";

import type { Teacher } from "@/app/student/teachers/teacher-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface RequestTeacherDialogProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequested: (teacherId: string) => void;
}

export function RequestTeacherDialog({
  teacher,
  open,
  onOpenChange,
  onRequested,
}: RequestTeacherDialogProps) {
  const [courseId, setCourseId] = React.useState<string>("");
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (teacher) {
      setCourseId(teacher.courses[0]?.id ?? "");
      setNote("");
      setIsSubmitting(false);
    }
  }, [teacher]);

  if (!teacher) return null;

  const canSubmit = Boolean(courseId) && !isSubmitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      onRequested(teacher.id);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Request {teacher.name}</DialogTitle>
          <DialogDescription>
            Pick the course you want to join and add an optional note. The
            teacher will accept or decline your request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {teacher.subjects.map((subject) => (
              <Badge key={subject} variant="outline">
                {subject}
              </Badge>
            ))}
            <Badge variant="secondary">{teacher.mode}</Badge>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="request-course"
              className={
                courseId
                  ? undefined
                  : "text-red-700 dark:text-red-300"
              }
            >
              Course {courseId ? "" : "(choose a course)"}
            </Label>
            {teacher.courses.length > 1 ? (
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger id="request-course" aria-label="Course">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {teacher.courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} · {course.mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground">
                {teacher.courses[0]?.name ?? "Course details coming soon"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-note">Note (optional)</Label>
            <Textarea
              id="request-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Anything the teacher should know before your first class..."
            />
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            <Send />
            {isSubmitting ? "Sending request..." : "Send request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
