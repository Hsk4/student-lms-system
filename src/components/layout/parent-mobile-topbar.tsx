"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { ChildSwitcher } from "@/components/shared/child-switcher";
import { NotificationsDrawer } from "@/components/shared/notifications-drawer";

export function ParentMobileTopbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-14 items-center gap-3 px-4">
        <Link href="/parent" className="flex items-center gap-2" aria-label="Home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Vidyalaya
          </span>
        </Link>

        <div className="ml-auto min-w-0">
          <ChildSwitcher align="end" compact />
        </div>

        <NotificationsDrawer />
      </div>
    </header>
  );
}
