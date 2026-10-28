"use client";

import * as React from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClassAttendanceGrid } from "@/app/teacher/mock/data";
import { formatDateOnly } from "@/lib/format";

const STATUS_LABELS: Record<string, { label: string; variant: "success" | "destructive" | "warning" | "info" }> = {
  present: { label: "P", variant: "success" },
  absent: { label: "A", variant: "destructive" },
  late: { label: "L", variant: "warning" },
  excused: { label: "E", variant: "info" },
};

export function ClassAttendanceTab({ classId }: { classId: string }) {
  const grid = React.useMemo(() => getClassAttendanceGrid(classId), [classId]);

  if (grid.dates.length === 0) {
    return (
      <EmptyState
        title="No attendance recorded yet"
        description="Take attendance from the Attendance page after a session."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/60 hover:bg-secondary/60">
            <TableHead className="sticky left-0 z-10 bg-card">Student</TableHead>
            {grid.dates.map((date) => (
              <TableHead key={date} className="whitespace-nowrap text-center">
                {formatDateOnly(date)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {grid.rows.map((row) => (
            <TableRow key={row.studentId}>
              <TableCell className="sticky left-0 z-10 bg-card font-medium text-foreground">
                {row.name}
              </TableCell>
              {row.statuses.map((status, index) => (
                <TableCell key={`${row.studentId}-${index}`} className="text-center">
                  {status ? (
                    <Badge
                      variant={STATUS_LABELS[status].variant}
                      className="mx-auto w-7 justify-center px-0"
                      title={status}
                    >
                      {STATUS_LABELS[status].label}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
