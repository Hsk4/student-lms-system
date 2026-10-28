"use client";

import * as React from "react";
import { CalendarClock, GraduationCap, Mail, TriangleAlert, User } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { EnrollmentRequest, TeacherClass } from "@/app/teacher/mock/types";
import { getClassRoster } from "@/app/teacher/mock/data";
import { formatDateTime } from "@/lib/format";

interface RequestDetailDrawerProps {
  request: EnrollmentRequest | null;
  classes: TeacherClass[];
  onOpenChange: (open: boolean) => void;
  onAcceptIntoClass: (classId: string) => void;
  onAcceptOneOnOne: () => void;
  onDecline: () => void;
}

export function RequestDetailDrawer({
  request,
  classes,
  onOpenChange,
  onAcceptIntoClass,
  onAcceptOneOnOne,
  onDecline,
}: RequestDetailDrawerProps) {
  const openClasses = classes.filter(
    (cls) => cls.status === "current" && getClassRoster(cls.id).length < cls.capacity,
  );

  if (!request) return null;

  return (
    <Sheet open={request !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-5 sm:max-w-md sm:p-6">
        <SheetHeader className="px-0 pt-0">
          <SheetTitle className="text-left text-base text-foreground">
            {request.studentName}
          </SheetTitle>
          <SheetDescription className="text-left">
            Enrollment request · {formatDateTime(request.requestedAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Student profile
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                {request.board} · {request.level}
              </li>
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Requested: {request.requestedSubjects.join(", ")}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {request.studentEmail}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Parent
            </h3>
            <p className="mt-2 text-sm font-medium text-foreground">{request.parentName}</p>
            <p className="text-xs text-muted-foreground">{request.parentEmail}</p>
          </div>

          {request.message ? (
            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Student&apos;s message
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">&ldquo;{request.message}&rdquo;</p>
            </div>
          ) : null}

          {request.mismatch ? (
            <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              Board/level mismatch: this student&apos;s board or level does not match your current
              courses.
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </p>
            {openClasses.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {openClasses.map((cls) => (
                  <Button
                    key={cls.id}
                    type="button"
                    variant="outline"
                    className="justify-between"
                    onClick={() => onAcceptIntoClass(cls.id)}
                  >
                    <span className="min-w-0 truncate">Accept into {cls.name}</span>
                    <Badge variant="accent" className="ml-2 shrink-0">
                      {cls.capacity - getClassRoster(cls.id).length} seats
                    </Badge>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No classes have open seats.</p>
            )}
            <Button type="button" onClick={onAcceptOneOnOne}>
              Accept one-on-one
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={onDecline}
            >
              Decline
            </Button>
          </div>

          {request.status !== "pending" ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              Decided {formatDateTime(request.decidedAt ?? "")} ·{" "}
              <StatusBadge status={request.status} />
            </p>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
