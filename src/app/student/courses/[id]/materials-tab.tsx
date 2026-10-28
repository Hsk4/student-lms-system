"use client";

import * as React from "react";
import { Download, FileText, Presentation, Video } from "lucide-react";

import type { StudentCourse } from "@/app/student/courses/courses-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CourseMaterial {
  id: string;
  title: string;
  type: string;
  size: string;
}

const MATERIALS_BY_COURSE: Record<string, CourseMaterial[]> = {
  "crs-1": [
    { id: "mat-11", title: "Quadratics — worked solutions", type: "PDF", size: "1.2 MB" },
    { id: "mat-12", title: "Polynomial functions deck", type: "Slides", size: "3.4 MB" },
    { id: "mat-13", title: "Factorising walkthrough", type: "Video", size: "48 MB" },
  ],
  "crs-2": [
    { id: "mat-21", title: "Kinematics graphs notes", type: "Notes", size: "0.6 MB" },
    { id: "mat-22", title: "Motion lab worksheet", type: "PDF", size: "0.8 MB" },
  ],
  "crs-3": [
    { id: "mat-31", title: "Periodic table mapping sheet", type: "PDF", size: "1.1 MB" },
    { id: "mat-32", title: "Organic chemistry intro", type: "Slides", size: "5.2 MB" },
    { id: "mat-33", title: "Bonding basics recording", type: "Video", size: "62 MB" },
  ],
  "crs-4": [
    { id: "mat-41", title: "Essay structure template", type: "Notes", size: "0.2 MB" },
    { id: "mat-42", title: "Comprehension pack", type: "PDF", size: "2.0 MB" },
  ],
  "crs-5": [
    { id: "mat-51", title: "Final revision summary", type: "Notes", size: "0.5 MB" },
  ],
};

function iconForType(type: string) {
  if (type === "Video") return Video;
  if (type === "Slides") return Presentation;
  return FileText;
}

export function MaterialsTab({ course }: { course: StudentCourse }) {
  const materials = MATERIALS_BY_COURSE[course.id] ?? [];

  if (materials.length === 0) {
    return (
      <EmptyState
        title="No material shared yet"
        description={`Resources shared by ${course.teacher} will appear here.`}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border/70">
        {materials.map((material) => {
          const Icon = iconForType(material.type);
          return (
            <li
              key={material.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {material.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {material.size}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="outline">{material.type}</Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Download ${material.title} (demo)`}
                  title="Download (demo only)"
                >
                  <Download />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
