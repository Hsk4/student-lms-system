"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Eye,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserCog,
} from "lucide-react";
import { useTheme } from "next-themes";

import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { findNavItem } from "@/components/layout/nav-config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AdminRole } from "@/types/user";

export function AdminHeader() {
  const pathname = usePathname();
  const { user, role, setRole, isSuperAdmin } = useCurrentUser();
  const { resolvedTheme, setTheme } = useTheme();

  const currentItem = findNavItem(pathname, isSuperAdmin);
  const title = currentItem?.label ?? "Admin";
  const description = currentItem?.description ?? "Dashboard";

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <MobileNavSheet />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {description}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <Button asChild variant="ghost" size="icon" aria-label="Settings">
          <Link href="/admin/settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-2 sm:inline-flex"
            >
              <Eye className="h-4 w-4" />
              View as: {role === "super_admin" ? "Super Admin" : "Admin"}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>View as</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => setRole("admin")}
              className={role === "admin" ? "bg-accent text-accent-foreground" : ""}
            >
              <UserCog className="h-4 w-4" />
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setRole("super_admin")}
              className={
                role === "super_admin" ? "bg-accent text-accent-foreground" : ""
              }
            >
              <UserCog className="h-4 w-4" />
              Super Admin
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground" disabled>
              <LogOut className="h-4 w-4" />
              Sign out (demo only)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 leading-tight lg:block">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <Badge
              variant={isSuperAdmin ? "default" : "secondary"}
              className="mt-0.5 px-1.5 py-0 text-[10px]"
            >
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}

export type { AdminRole };
