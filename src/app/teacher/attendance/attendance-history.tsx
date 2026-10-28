"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
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
import { getClassesForTeacher, getClassRoster, getStudentById } from "@/app/teacher/mock/data";
import { formatDateOnly } from "@/lib/format";

export function AttendanceHistory() {
  const classes = React.useMemo(() => getClassesForTeacher("current"), []);
  const [classId, setClassId] = React.useState(classes[0]?.id ?? "");
  const roster = React.useMemo(
    () => (classId ? getClassRoster(classId) : []),
    [classId],
  );

  if (classes.length === 0) {
    return (
      <EmptyState
        title="No classes yet"
        description="Attendance history appears once you take attendance for a class."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger className="w-[240px]" aria-label="Class">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm">
          <Download />
          Export CSV
        </Button>
      </div>

      {roster.length === 0 ? (
        <EmptyState
          title="No students in this class"
          description="Accept enrollment requests to build the roster first."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                <TableHead>Student</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="hidden sm:table-cell">Recent marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((entry) => {
                const student = getStudentById(entry.id);
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium text-foreground">{entry.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${student?.attendancePercent ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {student?.attendancePercent ?? 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex gap-1">
                        <Badge variant="success">P</Badge>
                        <Badge variant="warning">L</Badge>
                        <Badge variant="destructive">A</Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Month grid report · data shown for {formatDateOnly(new Date())} term. Marks are text-labelled
        (P/A/L/E) so they never rely on colour alone.
      </p>
    </div>
  );
}
