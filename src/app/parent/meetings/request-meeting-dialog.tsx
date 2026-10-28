"use client";

import * as React from "react";
import { CalendarClock, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentParent } from "@/hooks/use-current-parent";
import { dateIn, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface MeetingDialogPrefill {
  childId?: string;
  teacherName?: string;
  topic?: string;
}

export interface MeetingRequestSubmit {
  childId: string;
  childName: string;
  teacherName: string;
  topic: string;
  slot: string;
  slotLabel: string;
  notes: string;
}

interface RequestMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: MeetingDialogPrefill;
  onSubmit: (request: MeetingRequestSubmit) => void;
}

const TOPICS = [
  "Progress discussion",
  "Exam preparation",
  "Homework support",
  "Attendance concern",
  "Other",
];

function slotOptions(): string[] {
  return [dateIn(2, 17, 0), dateIn(3, 11, 0), dateIn(5, 18, 30)];
}

export function RequestMeetingDialog({
  open,
  onOpenChange,
  prefill,
  onSubmit,
}: RequestMeetingDialogProps) {
  const { linkedChildren, scopedChildId } = useCurrentParent();

  const slots = React.useMemo(slotOptions, []);

  const defaultedChildId =
    prefill?.childId ?? (scopedChildId === "all" ? undefined : scopedChildId);

  const defaultChild =
    linkedChildren.find((child) => child.id === defaultedChildId) ??
    linkedChildren.find((child) => child.teachers.length > 0) ??
    linkedChildren[0];

  const [childId, setChildId] = React.useState(defaultChild?.id ?? "");
  const [teacherName, setTeacherName] = React.useState(prefill?.teacherName ?? "");
  const [topic, setTopic] = React.useState(prefill?.topic ?? "");
  const [notes, setNotes] = React.useState("");
  const [slot, setSlot] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setErrors({});
    const child =
      linkedChildren.find((item) => item.id === defaultedChildId) ??
      linkedChildren.find((item) => item.teachers.length > 0) ??
      linkedChildren[0];
    setChildId(child?.id ?? "");
    setTeacherName(prefill?.teacherName ?? "");
    setTopic(prefill?.topic ?? "");
    setSlot("");
  }, [open, linkedChildren, prefill, defaultedChildId]);

  const selectedChild = linkedChildren.find((child) => child.id === childId);
  const availableTeachers = selectedChild?.teachers.map((t) => t.name) ?? [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!childId) nextErrors.childId = "Choose which child this meeting is for.";
    if (!teacherName) nextErrors.teacherName = "Pick a teacher.";
    if (!topic) nextErrors.topic = "Choose a topic.";
    if (!slot) nextErrors.slot = "Pick at least one preferred slot.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onOpenChange(false);
      onSubmit({
        childId,
        childName: selectedChild?.name ?? "",
        teacherName,
        topic,
        slot,
        slotLabel: slotLabel(slot),
        notes,
      });
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl sm:max-w-lg md:m-auto md:rounded-2xl"
      >
        <SheetHeader className="px-5 pt-5 text-left">
          <SheetTitle className="flex items-center gap-2 text-base text-foreground">
            <CalendarClock className="h-4 w-4 text-primary" />
            Request a meeting
          </SheetTitle>
          <SheetDescription className="sr-only">
            Send a meeting request to a child&apos;s teacher
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-6" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="meeting-child">Child</Label>
            <Select value={childId} onValueChange={(value) => {
              setChildId(value);
              setTeacherName("");
              setErrors((current) => ({ ...current, childId: "", teacherName: "" }));
            }}>
              <SelectTrigger id="meeting-child" aria-label="Child">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {linkedChildren.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name} · {child.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.childId ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.childId}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="meeting-teacher">Teacher</Label>
            <Select value={teacherName} onValueChange={(value) => {
              setTeacherName(value);
              setErrors((current) => ({ ...current, teacherName: "" }));
            }}>
              <SelectTrigger id="meeting-teacher" aria-label="Teacher">
                <SelectValue placeholder={availableTeachers.length ? "Select teacher" : "No teachers yet"} />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedChild && availableTeachers.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                This child has no teachers yet.
              </p>
            ) : null}
            {errors.teacherName ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.teacherName}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label>Preferred slots</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {slots.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSlot(option);
                    setErrors((current) => ({ ...current, slot: "" }));
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                    slot === option
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:bg-secondary",
                  )}
                  aria-pressed={slot === option}
                >
                  <span className="block font-medium">{formatDateTime(option)}</span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    30 min
                  </span>
                </button>
              ))}
            </div>
            {errors.slot ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.slot}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="meeting-topic">Topic</Label>
            <Select value={topic} onValueChange={(value) => {
              setTopic(value);
              setErrors((current) => ({ ...current, topic: "" }));
            }}>
              <SelectTrigger id="meeting-topic" aria-label="Topic">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.topic ? (
              <p className="text-xs font-medium text-destructive" role="alert">{errors.topic}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="meeting-notes">Notes (optional)</Label>
            <Textarea
              id="meeting-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Anything the teacher should know"
              rows={3}
            />
          </div>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || linkedChildren.length === 0}>
              {busy ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Save />
                  Send request
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function slotLabel(value: string): string {
  return formatDateTime(value);
}
