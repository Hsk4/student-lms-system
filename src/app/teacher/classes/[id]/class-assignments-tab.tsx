"use client";

import * as React from "react";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
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
import { getAssignmentsForClassGrid, getSubmissionCounts } from "@/app/teacher/mock/data";
import { formatDateOnly } from "@/lib/format";

export function ClassAssignmentsTab({ classId, className }: { classId: string; className: string }) {
  const assignments = React.useMemo(() => getAssignmentsForClassGrid(classId), [classId]);

  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments in this class yet"
        description="Create one and it will appear for every student in the roster."
        action={
          <Button asChild variant="outline">
            <Link href="/teacher/assignments/new">
              <FilePlus2 />
              New assignment
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href="/teacher/assignments/new">
            <FilePlus2 />
            New assignment
          </Link>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/60 hover:bg-secondary/60">
              <TableHead>Title</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => {
              const counts = getSubmissionCounts(assignment);
              return (
                <TableRow key={assignment.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/teacher/assignments/${assignment.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {assignment.title}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{className}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateOnly(assignment.dueDate)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {counts.submitted}/{counts.total}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={assignment.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
