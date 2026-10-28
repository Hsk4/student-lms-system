"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize?: number;
  visiblePages?: number[];
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageCount,
  totalItems,
  pageSize = 20,
  visiblePages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages =
    visiblePages ??
    Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 5);

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            type="button"
            size="icon"
            variant={pageNumber === page ? "default" : "ghost"}
            className="h-9 w-9"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
