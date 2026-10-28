"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ListToolbar,
  type FilterOption,
} from "@/components/shared/list-toolbar";
import { cn } from "@/lib/utils";

interface TeacherFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  subjects: string[];
  activeSubjects: string[];
  onToggleSubject: (subject: string) => void;
  board: string;
  onBoardChange: (value: string) => void;
  boardOptions: FilterOption[];
  availability: string;
  onAvailabilityChange: (value: string) => void;
  availabilityOptions: FilterOption[];
  onClear: () => void;
}

function SubjectChips({
  subjects,
  activeSubjects,
  onToggleSubject,
  wrap = false,
}: Pick<TeacherFiltersProps, "subjects" | "activeSubjects" | "onToggleSubject"> & {
  wrap?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-2",
        wrap ? "flex-wrap" : "overflow-x-auto pb-0.5",
      )}
    >
      {subjects.map((subject) => {
        const isActive = activeSubjects.includes(subject);
        return (
          <button
            key={subject}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggleSubject(subject)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {subject}
          </button>
        );
      })}
    </div>
  );
}

export function TeacherFilters({
  searchValue,
  onSearchChange,
  subjects,
  activeSubjects,
  onToggleSubject,
  board,
  onBoardChange,
  boardOptions,
  availability,
  onAvailabilityChange,
  availabilityOptions,
  onClear,
}: TeacherFiltersProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const controls = (compact = false) => (
    <div className={cn("flex flex-col", compact ? "gap-4" : "gap-3")}>
      <SubjectChips
        subjects={subjects}
        activeSubjects={activeSubjects}
        onToggleSubject={onToggleSubject}
        wrap={compact}
      />
      {compact ? (
        <ListToolbar
          searchPlaceholder="Search teachers..."
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filters={[
            {
              id: "board",
              label: "Board",
              options: boardOptions,
              value: board,
              onChange: onBoardChange,
            },
            {
              id: "availability",
              label: "Availability",
              options: availabilityOptions,
              value: availability,
              onChange: onAvailabilityChange,
            },
          ]}
          onClear={onClear}
        />
      ) : null}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden md:block">{controls(false)}</div>

      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              <SlidersHorizontal />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-5"
          >
            <SheetHeader className="p-0">
              <SheetTitle>Filter teachers</SheetTitle>
              <SheetDescription>
                Choose subjects, board and availability.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">{controls(true)}</div>
            <Button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="mt-5 w-full"
            >
              Done
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      <ListToolbar
        className="hidden md:flex"
        searchPlaceholder="Search teachers..."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        filters={[
          {
            id: "board",
            label: "Board",
            options: boardOptions,
            value: board,
            onChange: onBoardChange,
          },
          {
            id: "availability",
            label: "Availability",
            options: availabilityOptions,
            value: availability,
            onChange: onAvailabilityChange,
          },
        ]}
        onClear={onClear}
      />
    </div>
  );
}
