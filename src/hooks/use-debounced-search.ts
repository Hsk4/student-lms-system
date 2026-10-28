"use client";

import * as React from "react";

interface UseDebouncedSearchOptions {
  delay?: number;
  initialValue?: string;
}

interface UseDebouncedSearchResult {
  search: string;
  debouncedSearch: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
  isDebouncing: boolean;
}

export function useDebouncedSearch({
  delay = 300,
  initialValue = "",
}: UseDebouncedSearchOptions = {}): UseDebouncedSearchResult {
  const [search, setSearch] = React.useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = React.useState(initialValue);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), delay);
    return () => clearTimeout(timer);
  }, [search, delay]);

  const clearSearch = React.useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
  }, []);

  return {
    search,
    debouncedSearch,
    setSearch,
    clearSearch,
    isDebouncing: search !== debouncedSearch,
  };
}
