"use client";

import * as React from "react";
import { CalendarClock, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getChildById } from "@/app/parent/mock/data";
import type { EnrollmentStatus } from "@/app/parent/mock/types";

const STATUS_CHIP: Record<EnrollmentStatus, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  awaiting_teacher: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  none: "bg-secondary text-muted-foreground",
};

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  active: "Active",
  awaiting_teacher: "Awaiting teacher",
  none: "No enrollment",
};

interface ChildHeaderCardProps {
  childId: string;
  onRequestMeeting: () => void;
}

export function ChildHeaderCard({ childId, onRequestMeeting }: ChildHeaderCardProps) {
  const child = getChildById(childId);

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-lg font-semibold text-accent-foreground">
          {(child ? child.name : "")
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {child?.name}
            </h2>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                child ? STATUS_CHIP[child.status] : "",
              )}
            >
              {child ? STATUS_LABEL[child.status] : ""}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {child?.board} · {child?.level}
          </p>

          {child && child.subjects.length > 0 ? (
            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Users2 className="h-3 w-3" />
                Enrolled subjects
              </p>
              <ul className="flex flex-wrap gap-2">
                {child.subjects.map((subject) => (
                  <li
                    key={subject.id}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs"
                  >
                    <span className="font-medium text-foreground">{subject.subject}</span>
                    <span className="text-muted-foreground">
                      with {subject.teacherName}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">
              Not enrolled with any teacher yet.
            </p>
          )}
        </div>

        <div className="w-full shrink-0 sm:w-auto">
          <Button
            type="button"
            onClick={onRequestMeeting}
            className="w-full sm:w-auto"
            disabled={child?.teachers.length === 0}
          >
            <CalendarClock />
            Request meeting
          </Button>
          {child?.teachers.length === 0 ? (
            <Badge variant="secondary" className="mt-2 block text-center text-[10px]">
              No teachers to meet yet
            </Badge>
          ) : null}
        </div>
      </div>
    </section>
  );
}
