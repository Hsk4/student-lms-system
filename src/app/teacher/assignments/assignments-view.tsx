"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Copy, FilePlus2, MoreHorizontal, XCircle } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
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
import {
  getAssignmentsForTeacher,
  getClassesForTeacher,
  getSubmissionCounts,
} from "@/app/teacher/mock/data";
import { matchesDateRange } from "@/lib/date";
import { formatDateOnly } from "@/lib/format";

const PAGE_SIZE = 20;

export function AssignmentsView() {
  const load = useMockPageLoad();
  const [search, setSearch] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const assignments = React.useMemo(() => getAssignmentsForTeacher(), []);
  const classes = React.useMemo(() => getClassesForTeacher(), []);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return assignments.filter((assignment) => {
      const matchesSearch =
        term.length === 0 ||
        assignment.title.toLowerCase().includes(term) ||
        assignment.targetLabel.toLowerCase().includes(term);
      const matchesClass =
        classFilter === "all" ||
        assignment.targetId === classFilter ||
        (assignment.targetType === "student" && classFilter === "one-on-one");
      const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
      const matchesDate =
        dateRange === "all"
          ? true
          : dateRange === "upcoming"
            ? new Date(assignment.dueDate).getTime() > Date.now()
            : matchesDateRange(assignment.dueDate, dateRange);
      return matchesSearch && matchesClass && matchesStatus && matchesDate;
    });
  }, [assignments, search, classFilter, statusFilter, dateRange]);

  React.useEffect(() => {
    setPage(1);
  }, [search, classFilter, statusFilter, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setClassFilter("all");
    setStatusFilter("all");
    setDateRange("all");
  };

  if (load.isLoading) {
    return <LoadingSkeleton rows={8} columns={6} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load your assignments." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Assignments</h2>
          <p className="text-sm text-muted-foreground">
            Work you have assigned to your classes and one-on-one students.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/teacher/assignments/new">
            <FilePlus2 />
            New assignment
          </Link>
        </Button>
      </div>

      <ListToolbar
        searchPlaceholder="Search assignments…"
        searchValue={search}
        onSearchChange={setSearch}
        onClear={clearFilters}
        filters={[
          {
            id: "class",
            label: "Class",
            options: [
              { value: "all", label: "All targets" },
              ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
              { value: "one-on-one", label: "One-on-one students" },
            ],
            value: classFilter,
            onChange: setClassFilter,
          },
          {
            id: "status",
            label: "Status",
            options: [
              { value: "all", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "closed", label: "Closed" },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            id: "date",
            label: "Due date",
            options: [
              { value: "all", label: "Any due date" },
              { value: "upcoming", label: "Upcoming" },
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
            ],
            value: dateRange,
            onChange: setDateRange,
          },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Try clearing filters, or create a new assignment for one of your classes."
          action={
            <Button asChild variant="outline">
              <Link href="/teacher/assignments/new">
                <FilePlus2 />
                New assignment
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Target</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                <TableHead className="hidden lg:table-cell">Graded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((assignment) => {
                const counts = getSubmissionCounts(assignment);
                const percent = counts.total > 0 ? Math.round((counts.submitted / counts.total) * 100) : 0;
                return (
                  <TableRow key={assignment.id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/teacher/assignments/${assignment.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {assignment.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {assignment.targetLabel}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDateOnly(assignment.dueDate)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {counts.submitted}/{counts.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {counts.graded}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={assignment.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${assignment.title}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/teacher/assignments/${assignment.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <XCircle />
                            Close
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
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
