"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

import {
  MOCK_STUDENT_COURSES,
} from "@/app/student/courses/courses-list";
import {
  QUIZ_QUESTIONS,
  QUIZ_DRAFT_KEY,
} from "@/app/student/quizzes/quiz-history-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MATERIAL_OPTIONS = [
  { label: "No material (mixed bag)", value: "none" },
  { label: "Teacher's unit notes", value: "notes" },
  { label: "Textbook chapter questions", value: "textbook" },
];

export function NewQuizDialog({ open, onOpenChange }: NewQuizDialogProps) {
  const router = useRouter();
  const [courseId, setCourseId] = React.useState("");
  const [material, setMaterial] = React.useState("none");
  const [courseError, setCourseError] = React.useState(false);
  const [isStarting, setIsStarting] = React.useState(false);

  const activeCourses = MOCK_STUDENT_COURSES.filter(
    (course) => course.status === "active",
  );

  const handleStart = () => {
    if (!courseId) {
      setCourseError(true);
      return;
    }
    try {
      window.sessionStorage.setItem(
        QUIZ_DRAFT_KEY,
        JSON.stringify({ courseId, material }),
      );
    } catch {
      setIsStarting(false);
    }
    setIsStarting(true);
    window.setTimeout(() => {
      onOpenChange(false);
      router.push("/student/quizzes/take");
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New practice quiz</DialogTitle>
          <DialogDescription>
            Pick an enrolled course and you will get {QUIZ_QUESTIONS.length}{" "}
            short questions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="quiz-course"
              className={
                courseError ? "text-red-700 dark:text-red-300" : undefined
              }
            >
              Course
            </Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger id="quiz-course" aria-label="Course">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {activeCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.subject} · {course.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {courseError ? (
              <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                Choose a course before starting.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-material">Material (optional)</Label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger id="quiz-material" aria-label="Material">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={isStarting}
            onClick={handleStart}
          >
            <Play />
            {isStarting ? "Preparing quiz..." : "Start"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
