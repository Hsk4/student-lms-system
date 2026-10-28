"use client";

import * as React from "react";
import { ChevronsUpDown, Users } from "lucide-react";

import {
  ALL_CHILDREN_ID,
  useCurrentParent,
} from "@/hooks/use-current-parent";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ChildSwitcherProps {
  className?: string;
  align?: "start" | "center" | "end";
  compact?: boolean;
}

function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function ChildSwitcher({ className, align = "start", compact }: ChildSwitcherProps) {
  const {
    linkedChildren,
    selectedChildId,
    setSelectedChildId,
    isAllChildrenSelected,
    showSwitcher,
  } = useCurrentParent();

  const selectedChild = linkedChildren.find((child) => child.id === selectedChildId);
  const label = isAllChildrenSelected ? "All children" : (selectedChild?.name ?? "All children");
  const subtitle = isAllChildrenSelected
    ? `${linkedChildren.length} children linked`
    : (selectedChild?.level ?? "");

  const trigger = (
    <Button
      type="button"
      variant="outline"
      size={compact ? "sm" : "default"}
      className={cn("h-10 justify-between gap-2", className)}
      aria-label="Switch child"
    >
      <span className="flex min-w-0 items-center gap-2">
        {isAllChildrenSelected ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
          </span>
        ) : (
          <Avatar className="h-6 w-6 border border-border">
            <AvatarFallback className="bg-accent text-[10px] text-accent-foreground">
              {initialsFor(label)}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="min-w-0 text-left">
          <span className="block max-w-[160px] truncate text-sm font-medium leading-tight text-foreground">
            {label}
          </span>
          {!compact ? (
            <span className="block truncate text-[10px] leading-tight text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </span>
      </span>
      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-60">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Viewing data for
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setSelectedChildId(ALL_CHILDREN_ID)}
          className={cn(
            "gap-2",
            isAllChildrenSelected && "bg-accent text-accent-foreground",
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium">All children</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {linkedChildren.map((child) => (
          <DropdownMenuItem
            key={child.id}
            onClick={() => setSelectedChildId(child.id)}
            className={cn(
              "gap-2",
              !isAllChildrenSelected && selectedChildId === child.id && "bg-accent text-accent-foreground",
            )}
          >
            <Avatar className="h-6 w-6 border border-border">
              <AvatarFallback className="bg-accent text-[10px] text-accent-foreground">
                {initialsFor(child.name)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate font-medium">{child.name}</span>
              <span className="block truncate text-[10px] text-muted-foreground">
                {child.level}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
