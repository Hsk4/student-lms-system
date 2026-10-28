"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  placeholder?: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface ListToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  onClear?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function ListToolbar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  onClear,
  className,
  children,
}: ListToolbarProps) {
  const hasActiveFilters =
    searchValue.trim().length > 0 ||
    filters.some((filter) => filter.value !== "all");

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="relative w-full md:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Select
            key={filter.id}
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger
              className="w-[150px]"
              aria-label={filter.label}
            >
              <SelectValue placeholder={filter.placeholder ?? filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {children}

        {onClear && hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground"
          >
            <X />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
