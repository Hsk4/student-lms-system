"use client";

import * as React from "react";
import { CalendarClock, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TeacherStudent } from "@/app/teacher/mock/types";

interface StudentHeaderCardProps {
  student: TeacherStudent;
}

export function StudentHeaderCard({ student }: StudentHeaderCardProps) {
  const initials = student.name.split(" ").map((part) => part[0]).slice(0, 2).join("");

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border border-border">
            <AvatarFallback className="bg-accent text-base font-semibold text-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {student.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{student.board}</Badge>
              <Badge variant="secondary">{student.level}</Badge>
              <Badge variant={student.sessionType === "class" ? "accent" : "outline"}>
                {student.sessionType === "class" ? "Class" : "One-on-one"}
              </Badge>
              <Badge variant={student.status === "active" ? "success" : "secondary"}>
                {student.status === "active" ? "Active" : "Completed"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Subject taught by you: <span className="font-medium text-foreground">{student.subject}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/50 p-4 sm:min-w-[260px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Parent contact
          </p>
          <p className="mt-1.5 text-sm font-medium text-foreground">{student.parent.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {student.parent.email}
          </p>
          <Button type="button" size="sm" variant="outline" className="mt-3 w-full">
            <CalendarClock />
            Request meeting
          </Button>
        </div>
      </div>
    </section>
  );
}
