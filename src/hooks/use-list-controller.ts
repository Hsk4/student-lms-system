"use client";

import * as React from "react";

import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { usePagination } from "@/hooks/use-pagination";

export interface ListFilterOption {
  label: string;
  value: string;
}

export interface ListFilterDefinition<T> {
  id: string;
  field: keyof T;
  options: ListFilterOption[];
  label: string;
  match?: (item: T, value: string) => boolean;
}

interface UseListControllerOptions<T> {
  data: T[];
  searchFields: (item: T) => string;
  filters?: ListFilterDefinition<T>[];
  pageSize?: number;
  loadDelay?: number;
}

export interface ListController<T> {
  rows: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  pageCount: number;
  visiblePages: number[];
  search: string;
  setSearch: (value: string) => void;
  debouncedSearch: string;
  filterValues: Record<string, string>;
  setFilterValue: (id: string, value: string) => void;
  filters: ListFilterDefinition<T>[];
  isLoading: boolean;
  isError: boolean;
  simulateError: boolean;
  setSimulateError: (value: boolean) => void;
  retry: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  setPage: (page: number) => void;
}

export function useListController<T>({
  data,
  searchFields,
  filters = [],
  pageSize = 20,
  loadDelay = 700,
}: UseListControllerOptions<T>): ListController<T> {
  const { search, setSearch, debouncedSearch } = useDebouncedSearch();
  const [filterValues, setFilterValues] = React.useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadDelay);
    return () => clearTimeout(timer);
  }, [reloadToken, loadDelay]);

  const filtered = React.useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return data.filter((item) => {
      const matchesSearch =
        term.length === 0 || searchFields(item).toLowerCase().includes(term);

      const matchesFilters = filters.every((filter) => {
        const value = filterValues[filter.id] ?? "all";
        if (value === "all") return true;
        if (filter.match) return filter.match(item, value);
        return String(item[filter.field]) === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, debouncedSearch, filters, filterValues, searchFields]);

  const pagination = usePagination({
    totalItems: filtered.length,
    pageSize,
  });

  React.useEffect(() => {
    pagination.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filterValues]);

  const rows = React.useMemo(
    () => filtered.slice(pagination.startIndex, pagination.endIndex),
    [filtered, pagination.startIndex, pagination.endIndex]
  );

  const setFilterValue = React.useCallback((id: string, value: string) => {
    setFilterValues((current) => ({ ...current, [id]: value }));
  }, []);

  const clearFilters = React.useCallback(() => {
    setSearch("");
    setFilterValues({});
  }, [setSearch]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    Object.values(filterValues).some((value) => value !== "all");

  const setSimulateError = React.useCallback((value: boolean) => {
    setIsError(value);
  }, []);

  const retry = React.useCallback(() => {
    setIsError(false);
    setReloadToken((token) => token + 1);
  }, []);

  return {
    rows,
    totalItems: filtered.length,
    page: pagination.page,
    pageSize: pagination.pageSize,
    pageCount: pagination.pageCount,
    visiblePages: pagination.visiblePages,
    search,
    setSearch,
    debouncedSearch,
    filterValues,
    setFilterValue,
    filters,
    isLoading,
    isError,
    simulateError: isError,
    setSimulateError,
    retry,
    clearFilters,
    hasActiveFilters,
    setPage: pagination.setPage,
  };
}
