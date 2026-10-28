"use client";

import * as React from "react";
import Link from "next/link";
import { Bug, Book, BookMarked, Headphones } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";

interface BookEntry {
  id: string;
  title: string;
  author: string;
  note: string;
  kind: "book" | "audio";
}

interface BookGroup {
  course: string;
  books: BookEntry[];
}

const BOOK_GROUPS: BookGroup[] = [
  {
    course: "Mathematics",
    books: [
      {
        id: "book-21",
        title: "Algebra Unlocked",
        author: "R. Fernandes",
        note: "Recommended by Faisal Iqbal — chapters 3 and 4 pair with this month's lessons.",
        kind: "book",
      },
      {
        id: "book-22",
        title: "Geometry through puzzles",
        author: "M. Iyengar",
        note: "Optional: good extra practice before the geometry unit test.",
        kind: "book",
      },
    ],
  },
  {
    course: "Physics",
    books: [
      {
        id: "book-23",
        title: "Foundation Physics: Waves",
        author: "P. Mohan",
        note: "Recommended by Hina Raza — read chapter 1 before the kinematics unit.",
        kind: "book",
      },
      {
        id: "book-24",
        title: "Motion demos audio series",
        author: "Vidyalaya library",
        note: "Ten-minute episodes, one per lesson. A nice commute revision option.",
        kind: "audio",
      },
    ],
  },
  {
    course: "Chemistry",
    books: [
      {
        id: "book-25",
        title: "Chemistry in Motion",
        author: "S. Kulkarni",
        note: "Recommended by Salman Baig — chapters on bonding start next week.",
        kind: "book",
      },
    ],
  },
  {
    course: "English",
    books: [
      {
        id: "book-26",
        title: "The Craft of Persuasion",
        author: "A. D'Souza",
        note: "Recommended by Naveed Tariq — model essays for the persuasive unit.",
        kind: "book",
      },
    ],
  },
  {
    course: "Biology",
    books: [],
  },
];

const COURSE_OPTIONS = [
  { label: "All courses", value: "all" },
  ...BOOK_GROUPS.map((group) => ({ label: group.course, value: group.course })),
];

export default function BooksPage() {
  const controller = useMockPageLoad();
  const { search, debouncedSearch, setSearch } = useDebouncedSearch();
  const [course, setCourse] = React.useState("all");

  const term = debouncedSearch.trim().toLowerCase();
  const visibleGroups = BOOK_GROUPS.filter(
    (group) => course === "all" || group.course === course,
  ).map((group) =>
    term
      ? {
          ...group,
          books: group.books.filter(
            (book) =>
              `${book.title} ${book.author} ${book.note}`
                .toLowerCase()
                .includes(term),
          ),
        }
      : group,
  );

  const clearFilters = () => {
    setSearch("");
    setCourse("all");
  };

  const hasActiveFilters = term.length > 0 || course !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Books
          </h2>
          <p className="text-sm text-muted-foreground">
            Books recommended for you, grouped by course.
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
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : controller.isError ? (
        <ErrorState onRetry={controller.retry} />
      ) : (
        <React.Fragment>
          <ListToolbar
            searchPlaceholder="Search books or authors..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                id: "course",
                label: "Course",
                options: COURSE_OPTIONS,
                value: course,
                onChange: setCourse,
              },
            ]}
            onClear={hasActiveFilters ? clearFilters : undefined}
          />

          {visibleGroups.length === 0 ? (
            <EmptyState
              title="No courses match"
              description="Try clearing the search or choosing another course."
            />
          ) : (
            <div className="flex flex-col gap-6">
              {visibleGroups.map((group) => (
                <section key={group.course} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">
                      {group.course}
                    </h3>
                    <Badge variant="secondary">
                      {group.books.length} recommended
                    </Badge>
                  </div>

                  {group.books.length === 0 ? (
                    <EmptyState
                      title={`No ${group.course.toLowerCase()} books yet`}
                      description="Your teacher has not recommended any books for this course yet. Ask in the next class or leave a note with support."
                      icon={Book}
                      action={
                        <Button asChild variant="outline">
                          <Link href="/student/support">Ask for suggestions</Link>
                        </Button>
                      }
                    />
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                      {group.books.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-start gap-3 border-b border-border/70 px-4 py-3.5 last:border-b-0"
                        >
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                            {book.kind === "audio" ? (
                              <Headphones className="h-4 w-4" />
                            ) : (
                              <BookMarked className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {book.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {book.author} · {book.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}
