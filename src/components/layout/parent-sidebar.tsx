"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
} from "lucide-react";

import { getParentNavItems, isParentNavItemActive } from "@/components/layout/parent-nav-config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useCurrentParent } from "@/hooks/use-current-parent";
import { cn } from "@/lib/utils";

interface ParentSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function ParentSidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  className,
}: ParentSidebarProps) {
  const pathname = usePathname();
  const { parent } = useCurrentParent();
  const items = getParentNavItems();

  const initials = parent.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border bg-secondary/60 transition-[width] duration-200",
        className,
      )}
    >
      <Link
        href="/parent"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-4 py-5",
          collapsed && "justify-center px-2",
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </span>
        {!collapsed ? (
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">
              Vidyalaya
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Parent panel
            </span>
          </span>
        ) : null}
      </Link>

      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = isParentNavItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-accent-foreground"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                  />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      <div className={cn("flex items-center gap-3 p-4", collapsed && "justify-center px-2")}>
        <Avatar className="h-9 w-9 shrink-0 border border-border">
          <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        {!collapsed ? (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-foreground">{parent.name}</p>
            <p className="text-xs text-muted-foreground">Parent</p>
          </div>
        ) : null}
      </div>

      <div className="px-2 pb-3">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4 shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
