"use client";

import * as React from "react";
import { Download, FileText, Film, Link2, Presentation, Sheet } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getMaterialsForTeacher } from "@/app/teacher/mock/data";
import { formatDateOnly, formatFileSize } from "@/lib/format";

const TYPE_ICON = {
  pdf: FileText,
  worksheet: Sheet,
  slides: Presentation,
  video: Film,
  link: Link2,
} as const;

export function ClassMaterialsTab({ classId }: { classId: string }) {
  const materials = React.useMemo(
    () => getMaterialsForTeacher().filter((item) => item.courseId === classId),
    [classId],
  );

  if (materials.length === 0) {
    return (
      <EmptyState
        title="No materials for this class"
        description="Upload worksheets, notes or recordings from the Materials page."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {materials.map((material) => {
        const Icon = TYPE_ICON[material.fileType];
        return (
          <li
            key={material.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {material.title}
              </span>
              <span className="block text-xs text-muted-foreground">
                {material.fileType.toUpperCase()} ·{" "}
                {material.sizeBytes > 0 ? `${formatFileSize(material.sizeBytes)} · ` : ""}
                {formatDateOnly(material.uploadedAt)}
              </span>
            </span>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label={`Download ${material.title}`}>
              <Download className="h-4 w-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
