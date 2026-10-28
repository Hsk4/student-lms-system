"use client";

import * as React from "react";
import Link from "next/link";
import { Bug, Users } from "lucide-react";

import { TeacherCard, type Teacher } from "@/app/student/teachers/teacher-card";
import { RequestTeacherDialog } from "@/app/student/teachers/request-teacher-dialog";
import { TeacherFilters } from "@/app/student/teachers/teacher-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";

const MOCK_TEACHERS: Teacher[] = [
  {
    id: "tch-201",
    name: "Faisal Iqbal",
    board: "CBSE",
    level: "Grade 9–10",
    subjects: ["Mathematics"],
    mode: "Class",
    classesOpen: true,
    courses: [
      { id: "crs-1", name: "Algebra booster", mode: "Class" },
      { id: "crs-2", name: "Calculus intro", mode: "Class" },
    ],
  },
  {
    id: "tch-202",
    name: "Hina Raza",
    board: "CBSE",
    level: "Grade 8–10",
    subjects: ["Physics"],
    mode: "Class",
    classesOpen: true,
    courses: [{ id: "crs-3", name: "Kinematics & dynamics", mode: "Class" }],
  },
  {
    id: "tch-203",
    name: "Salman Baig",
    board: "ICSE",
    level: "Grade 9–10",
    subjects: ["Chemistry"],
    mode: "One-on-one",
    classesOpen: true,
    courses: [{ id: "crs-4", name: "Organic foundations", mode: "One-on-one" }],
  },
  {
    id: "tch-204",
    name: "Amber Qureshi",
    board: "CBSE",
    level: "Grade 8–10",
    subjects: ["Biology"],
    mode: "Class",
    classesOpen: true,
    courses: [{ id: "crs-5", name: "Life sciences", mode: "Class" }],
  },
  {
    id: "tch-205",
    name: "Naveed Tariq",
    board: "CBSE",
    level: "Grade 9",
    subjects: ["English"],
    mode: "One-on-one",
    classesOpen: true,
    courses: [{ id: "crs-6", name: "Essay writing clinic", mode: "One-on-one" }],
  },
  {
    id: "tch-206",
    name: "Shazia Mirza",
    board: "ICSE",
    level: "Grade 9–10",
    subjects: ["Mathematics"],
    mode: "Class",
    classesOpen: false,
    courses: [{ id: "crs-7", name: "Geometry intensive", mode: "Class" }],
  },
  {
    id: "tch-207",
    name: "Adnan Rehman",
    board: "CBSE",
    level: "Grade 10",
    subjects: ["Physics"],
    mode: "One-on-one",
    classesOpen: true,
    status: "declined",
    courses: [{ id: "crs-8", name: "Motion & forces", mode: "One-on-one" }],
  },
  {
    id: "tch-208",
    name: "Laraib Sheikh",
    board: "CBSE",
    level: "Grade 9–10",
    subjects: ["Computer Science"],
    mode: "Class",
    classesOpen: true,
    courses: [{ id: "crs-9", name: "Python fundamentals", mode: "Class" }],
  },
  {
    id: "tch-209",
    name: "Kamran Alvi",
    board: "CBSE",
    level: "Grade 8–10",
    subjects: ["Chemistry", "Biology"],
    mode: "One-on-one",
    classesOpen: true,
    courses: [
      { id: "crs-10", name: "Lab skills", mode: "One-on-one" },
      { id: "crs-11", name: "Exam revision", mode: "One-on-one" },
    ],
  },
];

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
];

const BOARD_OPTIONS = [
  { label: "All boards", value: "all" },
  { label: "CBSE", value: "CBSE" },
  { label: "ICSE", value: "ICSE" },
];

const AVAILABILITY_OPTIONS = [
  { label: "All teachers", value: "all" },
  { label: "Classes open", value: "open" },
  { label: "Classes closed", value: "closed" },
];

export default function TeachersPage() {
  const controller = useMockPageLoad();

  const [search, setSearch] = React.useState("");
  const [activeSubjects, setActiveSubjects] = React.useState<string[]>([]);
  const [board, setBoard] = React.useState("all");
  const [availability, setAvailability] = React.useState("all");
  const [requestedIds, setRequestedIds] = React.useState<string[]>([]);
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const debouncedSearch = useDebounced(search);

  const visibleTeachers = React.useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return MOCK_TEACHERS.filter((teacher) => {
      const matchesSearch =
        term.length === 0 ||
        `${teacher.name} ${teacher.subjects.join(" ")} ${teacher.board}`
          .toLowerCase()
          .includes(term);
      const matchesSubject =
        activeSubjects.length === 0 ||
        teacher.subjects.some((subject) => activeSubjects.includes(subject));
      const matchesBoard = board === "all" || teacher.board === board;
      const matchesAvailability =
        availability === "all" ||
        (availability === "open" && teacher.classesOpen) ||
        (availability === "closed" && !teacher.classesOpen);
      return (
        matchesSearch && matchesSubject && matchesBoard && matchesAvailability
      );
    });
  }, [debouncedSearch, activeSubjects, board, availability]);

  const handleRequest = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDialogOpen(true);
  };

  const handleRequested = (teacherId: string) => {
    setRequestedIds((current) =>
      current.includes(teacherId) ? current : [...current, teacherId],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setActiveSubjects([]);
    setBoard("all");
    setAvailability("all");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Teachers
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse teachers for your board and level, then request a pairing.
          </p>
        </div>
        <Button
          type="button"
          variant={controller.simulateError ? "destructive" : "outline"}
          size="sm"
          onClick={() => controller.setSimulateError(!controller.simulateError)}
          title="Dev toggle: simulate a failed request"
        >
          <Bug />
          Simulate error
        </Button>
      </div>

      {controller.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-52 rounded-xl" />
            ))}
          </div>
        </div>
      ) : controller.isError ? (
        <ErrorState
          title="We could not load teachers"
          description="Something went wrong while loading the teacher list. Try again."
          onRetry={controller.retry}
        />
      ) : (
        <React.Fragment>
          <TeacherFilters
            searchValue={search}
            onSearchChange={setSearch}
            subjects={SUBJECT_OPTIONS}
            activeSubjects={activeSubjects}
            onToggleSubject={(subject) =>
              setActiveSubjects((current) =>
                current.includes(subject)
                  ? current.filter((item) => item !== subject)
                  : [...current, subject],
              )
            }
            board={board}
            onBoardChange={setBoard}
            boardOptions={BOARD_OPTIONS}
            availability={availability}
            onAvailabilityChange={setAvailability}
            availabilityOptions={AVAILABILITY_OPTIONS}
            onClear={clearFilters}
          />

          {visibleTeachers.length === 0 ? (
            <EmptyState
              title="No teachers match this board and level yet"
              description="We are adding more teachers every week. Raise a request with the support team and we will help you find a fit."
              icon={Users}
              action={
                <Button asChild variant="outline">
                  <Link href="/student/support">Contact support</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  requested={requestedIds.includes(teacher.id)}
                  onRequest={handleRequest}
                />
              ))}
            </div>
          )}
        </React.Fragment>
      )}

      <RequestTeacherDialog
        teacher={selectedTeacher}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedTeacher(null);
        }}
        onRequested={handleRequested}
      />
    </div>
  );
}

function useDebounced(value: string, delay = 250): string {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
