"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut, Search, Settings, User } from "lucide-react";

import { findTeacherNavItem } from "@/components/layout/teacher-nav-config";
import { TeacherNotificationsDrawer } from "@/components/layout/teacher-notifications-drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentTeacher } from "@/hooks/use-current-teacher";

export function TeacherTopbar() {
  const pathname = usePathname();
  const { teacher } = useCurrentTeacher();

  const currentItem = findTeacherNavItem(pathname);

  const initials = teacher.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
            <Link href="/teacher" className="text-muted-foreground transition-colors hover:text-foreground">
              Teacher
            </Link>
            {currentItem && currentItem.href !== "/teacher" ? (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium text-foreground">{currentItem.label}</span>
              </>
            ) : null}
          </nav>
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {currentItem?.label ?? "Teacher dashboard"}
          </h1>
        </div>

        <div className="relative hidden w-72 xl:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students, classes, assignments…"
            aria-label="Global search"
            className="h-10 bg-card pl-9"
          />
        </div>

        <TeacherNotificationsDrawer />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block truncate text-sm font-semibold text-foreground">
                {teacher.name}
              </span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {teacher.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/teacher/profile" className="cursor-pointer">
                <User />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/teacher/profile" className="cursor-pointer">
                <Settings />
                Availability & notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut />
              Sign out (UI only)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
