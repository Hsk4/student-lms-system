"use client";

import * as React from "react";
import { Download, MoreHorizontal, Replace, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MaterialItem } from "@/app/teacher/mock/types";
import { MATERIAL_TYPE_ICON } from "@/app/teacher/materials/upload-material-dialog";
import { formatDateOnly, formatFileSize } from "@/lib/format";

interface MaterialsListProps {
  items: MaterialItem[];
}

export function MaterialsList({ items }: MaterialsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border/70">
        {items.map((material) => {
          const Icon = MATERIAL_TYPE_ICON[material.fileType];
          return (
            <li
              key={material.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <Icon className="h-5 w-5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {material.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {material.courseLabel} · {material.fileType.toUpperCase()}
                  {material.sizeBytes > 0 ? ` · ${formatFileSize(material.sizeBytes)}` : ""} ·{" "}
                  {formatDateOnly(material.uploadedAt)}
                </span>
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label={`Actions for ${material.title}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Replace />
                    Replace
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
