"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";

import { TeacherNotificationsDrawer } from "@/components/layout/teacher-notifications-drawer";
import { TeacherSidebar } from "@/components/layout/teacher-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Mobile/tablet shell: hamburger opens the sidebar as a drawer (Sheet). */
export function TeacherMobileDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 lg:hidden">
      <div className="flex h-14 items-center gap-3 px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open navigation menu"
              className="h-10 w-10 shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Teacher navigation sections</SheetDescription>
            </SheetHeader>
            <TeacherSidebar
              collapsed={false}
              onToggleCollapsed={() => setOpen(false)}
              onNavigate={() => setOpen(false)}
              className="h-full"
            />
          </SheetContent>
        </Sheet>

        <Link href="/teacher" className="flex items-center gap-2" aria-label="Teacher home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Vidyalaya
          </span>
        </Link>

        <div className="ml-auto">
          <TeacherNotificationsDrawer />
        </div>
      </div>
    </header>
  );
}
