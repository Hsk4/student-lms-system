"use client";

import * as React from "react";
import { CalendarClock, Monitor, UserRound } from "lucide-react";

import { getChildById } from "@/app/parent/mock/data";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TeachersTab({
  childId,
  onRequestMeeting,
}: {
  childId: string;
  onRequestMeeting: () => void;
}) {
  const child = getChildById(childId);

  if (!child || child.teachers.length === 0) {
    return (
      <EmptyState
        icon={UserRound}
        title="No teachers yet"
        description="Teacher contact cards appear here once your child enrolls."
        className="rounded-xl"
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {child.teachers.map((teacher) => (
        <article
          key={teacher.id}
          className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {teacher.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {teacher.name}
              </p>
              <p className="text-xs text-muted-foreground">{teacher.subject}</p>
            </div>
            <Badge variant={teacher.sessionType === "class" ? "accent" : "secondary"} className="shrink-0 text-[10px]">
              <span className="flex items-center gap-1">
                {teacher.sessionType === "class" ? (
                  <Monitor className="h-3 w-3" />
                ) : (
                  <UserRound className="h-3 w-3" />
                )}
                {teacher.sessionType === "class" ? "Class" : "One-on-one"}
              </span>
            </Badge>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            {teacher.schedule}
          </p>

          <div className="mt-4 flex flex-1 items-end">
            <Button type="button" variant="outline" className="w-full" onClick={onRequestMeeting}>
              <CalendarClock />
              Request meeting
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
