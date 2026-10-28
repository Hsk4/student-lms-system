"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, MoreHorizontal } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getStudentsForTeacher } from "@/app/teacher/mock/data";
import type { TeacherStudent } from "@/app/teacher/mock/types";
import { formatDateOnly } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

const BOARDS = ["CBSE Board", "ICSE Board", "Federal Board"];
const LEVELS = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 12"];
const TYPES = [
  { value: "class", label: "Class" },
  { value: "one-on-one", label: "One-on-one" },
];

type SortKey = "name" | "attendancePercent" | "averageGradePercent";

function initialsOf(name: string): string {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("");
}

function attendanceBar(percent: number) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percent}%</span>
    </div>
  );
}

export function StudentsView() {
  const load = useMockPageLoad();
  const [search, setSearch] = React.useState("");
  const [board, setBoard] = React.useState("all");
  const [level, setLevel] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);

  const allStudents = React.useMemo(() => getStudentsForTeacher(), []);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = allStudents.filter((student) => {
      const matchesSearch =
        term.length === 0 ||
        student.name.toLowerCase().includes(term) ||
        student.parent.name.toLowerCase().includes(term);
      const matchesBoard = board === "all" || student.board === board;
      const matchesLevel = level === "all" || student.level === level;
      const matchesType = type === "all" || student.sessionType === type;
      const matchesStatus = status === "all" || student.status === status;
      return matchesSearch && matchesBoard && matchesLevel && matchesType && matchesStatus;
    });

    return rows.sort((a, b) => {
      const direction = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * direction;
      return (a[sortKey] - b[sortKey]) * direction;
    });
  }, [allStudents, search, board, level, type, status, sortKey, sortDir]);

  React.useEffect(() => {
    setPage(1);
  }, [search, board, level, type, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortHeader = ({
    label,
    columnKey,
  }: {
    label: string;
    columnKey: SortKey;
  }) => {
    const active = sortKey === columnKey;
    const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <button
        type="button"
        onClick={() => toggleSort(columnKey)}
        className={cn(
          "inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    );
  };

  const clearFilters = () => {
    setSearch("");
    setBoard("all");
    setLevel("all");
    setType("all");
    setStatus("all");
  };

  if (load.isLoading) {
    return <LoadingSkeleton rows={8} columns={6} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load your students." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            My Students
          </h2>
          <p className="text-sm text-muted-foreground">
            {allStudents.filter((student) => student.status === "active").length} active ·{" "}
            {allStudents.length} total linked to you
          </p>
        </div>
        <Button type="button" variant="outline" size="sm">
          <Download />
          Export CSV
        </Button>
      </div>

      <ListToolbar
        searchPlaceholder="Search students or parents…"
        searchValue={search}
        onSearchChange={setSearch}
        onClear={clearFilters}
        filters={[
          {
            id: "board",
            label: "Board",
            options: [{ value: "all", label: "All boards" }, ...BOARDS.map((value) => ({ value, label: value }))],
            value: board,
            onChange: setBoard,
          },
          {
            id: "level",
            label: "Level",
            options: [{ value: "all", label: "All levels" }, ...LEVELS.map((value) => ({ value, label: value }))],
            value: level,
            onChange: setLevel,
          },
          {
            id: "type",
            label: "Type",
            options: [{ value: "all", label: "All types" }, ...TYPES],
            value: type,
            onChange: setType,
          },
          {
            id: "status",
            label: "Status",
            options: [
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
            ],
            value: status,
            onChange: setStatus,
          },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="Accept an enrollment request and the student will appear here."
          action={
            <Button asChild variant="outline">
              <Link href="/teacher/requests">View requests</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                <TableHead><SortHeader label="Student" columnKey="name" /></TableHead>
                <TableHead className="hidden md:table-cell">Board / Level</TableHead>
                <TableHead className="hidden lg:table-cell">Type</TableHead>
                <TableHead><SortHeader label="Attendance" columnKey="attendancePercent" /></TableHead>
                <TableHead><SortHeader label="Avg grade" columnKey="averageGradePercent" /></TableHead>
                <TableHead className="hidden xl:table-cell">Last activity</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((student) => (
                <TableRow key={student.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/teacher/students/${student.id}`}
                      className="flex items-center gap-3 font-medium text-foreground hover:text-primary"
                    >
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                          {initialsOf(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0">
                        <span className="block truncate">{student.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {student.subject}
                        </span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {student.board.replace(" Board", "")} · {student.level}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={student.sessionType === "class" ? "accent" : "secondary"}>
                      {student.sessionType === "class" ? "Class" : "One-on-one"}
                    </Badge>
                  </TableCell>
                  <TableCell>{attendanceBar(student.attendancePercent)}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {student.averageGradePercent}%
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                    {formatDateOnly(student.lastActivityAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${student.name}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/teacher/students/${student.id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Message parent</DropdownMenuItem>
                        <DropdownMenuItem>Request meeting</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination
        page={page}
        pageCount={pageCount}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <div className="flex justify-end">
        <Button
          type="button"
          variant={load.simulateError ? "destructive" : "ghost"}
          size="sm"
          onClick={() => load.setSimulateError(!load.simulateError)}
          title="Dev toggle: simulate a failed request on next load"
        >
          Simulate error
        </Button>
      </div>
    </div>
  );
}
