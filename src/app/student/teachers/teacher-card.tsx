"use client";

import * as React from "react";
import { BadgeCheck, MessageSquareWarning } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

export interface TeacherCourse {
  id: string;
  name: string;
  mode: string;
}

export interface Teacher {
  id: string;
  name: string;
  board: string;
  level: string;
  subjects: string[];
  mode: string;
  classesOpen: boolean;
  status?: string;
  courses: TeacherCourse[];
}

interface TeacherCardProps {
  teacher: Teacher;
  requested: boolean;
  onRequest: (teacher: Teacher) => void;
}

export function TeacherCard({ teacher, requested, onRequest }: TeacherCardProps) {
  const initials = teacher.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  const isDeclined = teacher.status === "declined";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        isDeclined && "opacity-90",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {teacher.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {teacher.board} · {teacher.level}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {teacher.subjects.map((subject) => (
          <Badge key={subject} variant="outline">
            {subject}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isDeclined ? (
          <StatusBadge status="rejected" label="Declined" />
        ) : requested ? (
          <StatusBadge status="requested" label="Request sent" />
        ) : (
          <Badge variant={teacher.classesOpen ? "success" : "secondary"}>
            {teacher.classesOpen ? "Classes open" : "Classes closed"}
          </Badge>
        )}
        <Badge variant="secondary">{teacher.mode}</Badge>
      </div>

      {isDeclined ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageSquareWarning className="h-3.5 w-3.5" />
          This teacher declined the pairing. Pick someone else.
        </p>
      ) : (
        <Button
          type="button"
          disabled={requested || !teacher.classesOpen}
          onClick={() => onRequest(teacher)}
        >
          <BadgeCheck />
          {requested
            ? "Request sent"
            : teacher.classesOpen
              ? "Request"
              : "Classes closed"}
        </Button>
      )}
    </div>
  );
}
