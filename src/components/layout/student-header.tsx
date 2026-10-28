"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { StudentMobileNavSheet } from "@/components/layout/student-mobile-nav-sheet";
import { findStudentNavItem } from "@/components/layout/student-nav-config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentStudent } from "@/hooks/use-current-student";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function StudentHeader() {
  const pathname = usePathname();
  const student = useCurrentStudent();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const currentItem = findStudentNavItem(pathname);
  const title = currentItem?.label ?? "Student";
  const description = currentItem?.description ?? "Dashboard";

  const initials = student.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <StudentMobileNavSheet />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {description}
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Theme: light, dark or system"
            >
              {mounted && theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : mounted && theme === "system" ? (
                <Monitor className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-2">
            <div role="radiogroup" aria-label="Colour theme" className="flex flex-col gap-0.5">
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = mounted && theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{option.label}</span>
                    {isActive ? <Check className="h-4 w-4 text-primary" /> : null}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 leading-tight lg:block">
            <p className="truncate text-sm font-medium text-foreground">
              {student.name}
            </p>
            <Badge variant="secondary" className="mt-0.5 px-1.5 py-0 text-[10px]">
              {student.level}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
