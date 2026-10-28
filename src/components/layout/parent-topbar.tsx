"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";

import { findParentNavItem } from "@/components/layout/parent-nav-config";
import { ChildSwitcher } from "@/components/shared/child-switcher";
import { NotificationsDrawer } from "@/components/shared/notifications-drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentParent } from "@/hooks/use-current-parent";

export function ParentTopbar() {
  const pathname = usePathname();
  const { parent } = useCurrentParent();

  const currentItem = findParentNavItem(pathname);
  const title = currentItem?.label ?? "Parent dashboard";
  const description = currentItem?.description ?? "Follow your children";

  const initials = parent.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground lg:block">
            {description}
          </p>
        </div>

        <div className="hidden md:block">
          <ChildSwitcher className="w-[220px]" />
        </div>

        <NotificationsDrawer />

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
                {parent.name}
              </span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {parent.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/parent/profile" className="cursor-pointer">
                <User />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/parent/profile" className="cursor-pointer">
                <Settings />
                Notification settings
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
