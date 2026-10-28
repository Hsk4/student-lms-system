"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClassesForTeacher, getGradebookForClass } from "@/app/teacher/mock/data";
import { formatDateOnly } from "@/lib/format";
import { GradeCellPopover } from "@/app/teacher/gradebook/grade-cell-popover";

export function GradebookGrid() {
  const classes = React.useMemo(() => getClassesForTeacher("current"), []);
  const [classId, setClassId] = React.useState<string>("");
  const [term, setTerm] = React.useState("current");
  const [override, setOverride] = React.useState<
    Record<string, { value: number | null; feedback: string }>
  >({});

  const gradebook = React.useMemo(
    () => (classId ? getGradebookForClass(classId) : null),
    [classId],
  );

  const handleSaveCell = (
    assignmentId: string,
    studentId: string,
    value: number | null,
    feedback: string,
  ) => {
    setOverride((current) => ({
      ...current,
      [`${assignmentId}:${studentId}`]: { value, feedback },
    }));
  };

  if (classes.length === 0) {
    return (
      <EmptyState
        title="No classes yet"
        description="Create a class and add assignments to build a gradebook."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger className="w-[240px]" aria-label="Select class (required)">
            <SelectValue placeholder="Select a class…" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={term} onValueChange={setTerm}>
          <SelectTrigger className="w-[160px]" aria-label="Term">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current term</SelectItem>
            <SelectItem value="previous">Previous term</SelectItem>
          </SelectContent>
        </Select>

        <Button type="button" variant="outline" size="sm" disabled={!classId}>
          <Download />
          Export CSV
        </Button>
      </div>

      {!gradebook ? (
        <EmptyState
          title="Pick a class"
          description="Choose one of your classes to see its gradebook grid."
        />
      ) : gradebook.columns.length === 0 ? (
        <EmptyState
          title="No assignments in this class yet"
          description="Create and publish an assignment to start grading here."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                <TableHead className="sticky left-0 z-20 min-w-[160px] bg-card">
                  Student
                </TableHead>
                {gradebook.columns.map((column) => (
                  <TableHead key={column.assignmentId} className="min-w-[130px]">
                    <span className="block truncate" title={column.title}>
                      {column.title}
                    </span>
                    <span className="block text-[10px] font-normal text-muted-foreground">
                      {formatDateOnly(column.dueDate)} · max {column.maxGrade}
                    </span>
                  </TableHead>
                ))}
                <TableHead className="min-w-[90px]">Average</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradebook.rows.map((row) => (
                <TableRow key={row.studentId}>
                  <TableCell className="sticky left-0 z-10 bg-card font-medium text-foreground">
                    {row.studentName}
                  </TableCell>
                  {row.cells.map((cell) => {
                    const key = `${cell.assignmentId}:${cell.studentId}`;
                    const cellValue = override[key]?.value ?? cell.value;
                    const column = gradebook.columns.find((item) => item.assignmentId === cell.assignmentId)!;
                    return (
                      <TableCell key={key} className="text-center">
                        <GradeCellPopover
                          cell={{ ...cell, value: cellValue }}
                          column={column}
                          studentName={row.studentName}
                          onSave={handleSaveCell}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center text-sm font-semibold text-foreground">
                    {row.average !== null ? `${row.average}%` : "–"}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-secondary/50 font-medium">
                <TableCell className="sticky left-0 z-10 bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                  Class average
                </TableCell>
                {gradebook.columnAverages.map((column) => (
                  <TableCell key={column.assignmentId} className="text-center text-sm text-foreground">
                    {column.average !== null ? column.average : "–"}
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
