"use client";

import * as React from "react";

interface UsePaginationOptions {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationResult {
  page: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetPage: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  visiblePages: number[];
}

export function usePagination({
  totalItems,
  pageSize = 20,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationResult {
  const [page, setPageState] = React.useState(initialPage);

  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  React.useEffect(() => {
    setPageState((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const setPage = React.useCallback((next: number) => {
    setPageState(Math.min(Math.max(1, next), Math.max(1, pageCount)));
  }, [pageCount]);

  const nextPage = React.useCallback(() => {
    setPageState((current) => Math.min(current + 1, pageCount));
  }, [pageCount]);

  const previousPage = React.useCallback(() => {
    setPageState((current) => Math.max(current - 1, 1));
  }, []);

  const resetPage = React.useCallback(() => setPageState(1), []);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const visiblePages = React.useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(pageCount, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, pageCount]);

  return {
    page,
    pageSize,
    pageCount,
    totalItems,
    startIndex,
    endIndex,
    setPage,
    nextPage,
    previousPage,
    resetPage,
    canGoPrevious: page > 1,
    canGoNext: page < pageCount,
    visiblePages,
  };
}
