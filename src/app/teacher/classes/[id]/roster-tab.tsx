"use client";

import * as React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getClassRoster, getStudentById } from "@/app/teacher/mock/data";

export function RosterTab({ classId }: { classId: string }) {
  const roster = React.useMemo(() => getClassRoster(classId), [classId]);

  if (roster.length === 0) {
    return (
      <EmptyState
        title="No students in this class"
        description="Students join a class only by accepting an enrollment request."
        action={
          <Button asChild variant="outline">
            <Link href="/teacher/requests">
              <UserPlus />
              View requests
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/60 hover:bg-secondary/60">
              <TableHead>Student</TableHead>
              <TableHead>Avg grade</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="text-right">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roster.map((entry) => {
              const student = getStudentById(entry.id);
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Link
                      href={`/teacher/students/${entry.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {entry.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student ? `${student.averageGradePercent}%` : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student ? `${student.attendancePercent}%` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Students can only be added by accepting an enrollment request —{" "}
        <Link href="/teacher/requests" className="font-medium text-primary hover:underline">
          go to requests
        </Link>
        .
      </p>
    </div>
  );
}
