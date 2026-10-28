"use client";

import * as React from "react";
import { Loader2, Users } from "lucide-react";

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

const COURSE_OPTIONS = [
  "Mathematics G6 – Basics",
  "Mathematics G9 – Foundation",
  "Mathematics G10 – Board Prep",
];

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (name: string) => void;
}

export function CreateClassDialog({ open, onOpenChange, onCreated }: CreateClassDialogProps) {
  const [name, setName] = React.useState("");
  const [course, setCourse] = React.useState<string>(COURSE_OPTIONS[0]);
  const [days, setDays] = React.useState<string[]>(["Mon", "Wed"]);
  const [startTime, setStartTime] = React.useState("17:00");
  const [capacity, setCapacity] = React.useState("15");
  const [meetingLink, setMeetingLink] = React.useState("");
  const [errors, setErrors] = React.useState<{ name?: string; days?: string; capacity?: string }>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName("");
      setCourse(COURSE_OPTIONS[0]);
      setDays(["Mon", "Wed"]);
      setStartTime("17:00");
      setCapacity("15");
      setMeetingLink("");
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const toggleDay = (day: string) => {
    setDays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day],
    );
    setErrors((current) => ({ ...current, days: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (name.trim().length < 4) nextErrors.name = "Give the class a clear name.";
    if (days.length === 0) nextErrors.days = "Pick at least one day.";
    const capacityNumber = Number(capacity);
    if (!capacity || Number.isNaN(capacityNumber) || capacityNumber < 1 || capacityNumber > 100) {
      nextErrors.capacity = "Capacity must be between 1 and 100.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // handleCreateClass — replace with a real API call later.
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onCreated?.(name.trim());
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Create class</DialogTitle>
            <DialogDescription>
              Group students into a class with a fixed weekly schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="class-name">Class name</Label>
              <Input
                id="class-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((current) => ({ ...current, name: undefined }));
                }}
                placeholder="e.g. Mathematics G9 – Weekend batch"
                aria-invalid={errors.name ? true : undefined}
              />
              {errors.name ? (
                <p className="text-xs font-medium text-destructive" role="alert">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger aria-label="Course"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COURSE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Schedule days</Label>
              <div className="flex flex-wrap gap-1.5">
                {DAY_OPTIONS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    aria-pressed={days.includes(day)}
                    className={
                      days.includes(day)
                        ? "rounded-lg border border-primary bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
                        : "rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                    }
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.days ? (
                <p className="text-xs font-medium text-destructive" role="alert">{errors.days}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="class-time">Start time</Label>
                <Input
                  id="class-time"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="class-capacity">Capacity</Label>
                <Input
                  id="class-capacity"
                  type="number"
                  min={1}
                  max={100}
                  value={capacity}
                  onChange={(event) => {
                    setCapacity(event.target.value);
                    setErrors((current) => ({ ...current, capacity: undefined }));
                  }}
                  aria-invalid={errors.capacity ? true : undefined}
                />
                {errors.capacity ? (
                  <p className="text-xs font-medium text-destructive" role="alert">{errors.capacity}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="class-link">Meeting link (optional)</Label>
              <Input
                id="class-link"
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                placeholder="https://meet.school.edu/…"
                inputMode="url"
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
                  Creating…
                </>
              ) : (
                <>
                  <Users />
                  Create class
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
