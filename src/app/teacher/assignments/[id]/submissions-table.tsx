"use client";

import * as React from "react";
import { Bell, ChevronRight } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Submission, SubmissionStatus } from "@/app/teacher/mock/types";
import { formatDateTime } from "@/lib/format";

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "missing", label: "Missing" },
  { value: "graded", label: "Graded" },
  { value: "late", label: "Late" },
];

function matchesFilter(status: SubmissionStatus, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "submitted") return status === "submitted" || status === "late" || status === "resubmission";
  if (filter === "missing") return status === "missing";
  if (filter === "graded") return status === "graded";
  if (filter === "late") return status === "late";
  return true;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  maxGrade: number;
  filter: string;
  onFilterChange: (filter: string) => void;
  onGrade: (submission: Submission) => void;
  onRemind: (submission: Submission) => void;
}

export function SubmissionsTable({
  submissions,
  maxGrade,
  filter,
  onFilterChange,
  onGrade,
  onRemind,
}: SubmissionsTableProps) {
  const rows = submissions.filter((submission) => matchesFilter(submission.status, filter));

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={filter} onValueChange={onFilterChange}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          {FILTERS.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="shrink-0">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/60 hover:bg-secondary/60">
              <TableHead>Student</TableHead>
              <TableHead className="hidden md:table-cell">Submitted at</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No students in this view.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium text-foreground">
                    {submission.studentName}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {submission.submittedAt ? formatDateTime(submission.submittedAt) : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {submission.grade !== undefined && submission.grade !== null
                      ? `${submission.grade}/${maxGrade}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {submission.status === "missing" ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => onRemind(submission)}>
                        <Bell />
                        Remind
                      </Button>
                    ) : submission.submittedAt ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => onGrade(submission)}>
                        Grade
                        <ChevronRight />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
