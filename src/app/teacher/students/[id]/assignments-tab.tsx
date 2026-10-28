"use client";

import * as React from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GradingPanel } from "@/app/teacher/assignments/[id]/grading-panel";
import { getAssignmentsForStudent, getStudentById } from "@/app/teacher/mock/data";
import { formatDateOnly } from "@/lib/format";

export function StudentAssignmentsTab({ studentId }: { studentId: string }) {
  const rows = React.useMemo(() => getAssignmentsForStudent(studentId), [studentId]);
  const student = getStudentById(studentId);
  const [grading, setGrading] = React.useState<{ assignmentIndex: number } | null>(null);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        description={`Assignments given to ${student?.name ?? "this student"} will appear here.`}
      />
    );
  }

  const gradingRow = grading ? rows[grading.assignmentIndex] : null;

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/60 hover:bg-secondary/60">
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Due date</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.assignment.id}
                className="cursor-pointer"
                onClick={() => setGrading({ assignmentIndex: index })}
              >
                <TableCell className="font-medium text-foreground">
                  {row.assignment.title}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {formatDateOnly(row.assignment.dueDate)}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {row.submission?.submittedAt ? formatDateOnly(row.submission.submittedAt) : "—"}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">
                  {row.submission?.grade !== undefined && row.submission?.grade !== null
                    ? `${row.submission.grade}/${row.assignment.maxGrade}`
                    : "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.submission?.status ?? "missing"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={grading !== null} onOpenChange={(open) => !open && setGrading(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-5 sm:max-w-3xl sm:p-6">
          <SheetHeader className="px-0 pt-0">
            <SheetTitle className="text-left text-base text-foreground">
              {gradingRow?.assignment.title}
            </SheetTitle>
            <SheetDescription className="text-left">
              Grade this submission — saved locally in the demo.
            </SheetDescription>
          </SheetHeader>
          {gradingRow && gradingRow.submission?.submittedAt ? (
            <GradingPanel
              className="mt-4"
              assignment={gradingRow.assignment}
              submission={gradingRow.submission}
              onClose={() => setGrading(null)}
            />
          ) : (
            <p className="mt-6 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-8 text-center text-sm text-muted-foreground">
              Nothing submitted yet for this assignment.
            </p>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
