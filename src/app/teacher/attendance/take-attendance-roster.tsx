"use client";

import * as React from "react";
import { Check, Loader2, StickyNote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/app/teacher/mock/types";

const OPTIONS: { value: AttendanceStatus; label: string; short: string }[] = [
  { value: "present", label: "Present", short: "P" },
  { value: "absent", label: "Absent", short: "A" },
  { value: "late", label: "Late", short: "L" },
  { value: "excused", label: "Excused", short: "E" },
];

export interface RosterEntry {
  studentId: string;
  name: string;
  status: AttendanceStatus;
  note?: string;
}

interface TakeAttendanceRosterProps {
  roster: RosterEntry[];
  onChange: (studentId: string, status: AttendanceStatus, note?: string) => void;
  readOnly?: boolean;
}

export function TakeAttendanceRoster({ roster, onChange, readOnly }: TakeAttendanceRosterProps) {
  const [noteFor, setNoteFor] = React.useState<string | null>(null);
  const [noteDraft, setNoteDraft] = React.useState("");

  const markAllPresent = () => {
    roster.forEach((entry) => onChange(entry.studentId, "present"));
  };

  return (
    <div className="flex flex-col gap-3">
      {!readOnly ? (
        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={markAllPresent}>
            <Check />
            Mark all present
          </Button>
        </div>
      ) : null}

      <ul className="flex flex-col gap-2">
        {roster.map((entry) => (
          <li
            key={entry.studentId}
            className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-foreground">{entry.name}</p>

              <div className="flex items-center gap-2">
                <div
                  role="radiogroup"
                  aria-label={`Attendance for ${entry.name}`}
                  className="grid flex-1 grid-cols-4 gap-1 rounded-xl bg-secondary p-1 sm:flex-none"
                >
                  {OPTIONS.map((option) => {
                    const active = entry.status === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={readOnly}
                        onClick={() => onChange(entry.studentId, option.value, entry.note)}
                        className={cn(
                          "flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all sm:min-h-[40px]",
                          active
                            ? option.value === "present"
                              ? "bg-emerald-600 text-white shadow"
                              : option.value === "absent"
                                ? "bg-red-600 text-white shadow"
                                : option.value === "late"
                                  ? "bg-amber-600 text-white shadow"
                                  : "bg-sky-600 text-white shadow"
                            : "text-muted-foreground hover:text-foreground",
                          readOnly && "cursor-not-allowed opacity-70",
                        )}
                      >
                        <span className="hidden sm:inline">{option.label}</span>
                        <span className="sm:hidden">{option.short}</span>
                      </button>
                    );
                  })}
                </div>

                {!readOnly ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    aria-label={`Add note for ${entry.name}`}
                    onClick={() => {
                      setNoteFor(noteFor === entry.studentId ? null : entry.studentId);
                      setNoteDraft(entry.note ?? "");
                    }}
                  >
                    <StickyNote className={cn("h-4 w-4", entry.note && "text-primary")} />
                  </Button>
                ) : null}
              </div>
            </div>

            {entry.note && noteFor !== entry.studentId ? (
              <p className="mt-2 text-xs text-muted-foreground">Note: {entry.note}</p>
            ) : null}

            {noteFor === entry.studentId ? (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder="e.g. Sick leave informed by parent"
                  aria-label={`Note for ${entry.name}`}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onChange(entry.studentId, entry.status, noteDraft.trim() || undefined);
                    setNoteFor(null);
                  }}
                >
                  Save
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SaveAttendanceBar({
  present,
  absent,
  saving,
  saved,
  onSave,
}: {
  present: number;
  absent: number;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-20 z-20 lg:bottom-6">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/85">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{present} present</span> ·{" "}
          <span className="font-semibold text-foreground">{absent} absent</span>
          {saved ? (
            <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
              <Check className="h-4 w-4" />
              Saved
            </span>
          ) : null}
        </p>
        <Button type="button" onClick={onSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check />}
          {saving ? "Saving…" : "Save attendance"}
        </Button>
      </div>
    </div>
  );
}
