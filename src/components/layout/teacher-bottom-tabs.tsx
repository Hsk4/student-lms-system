"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  FolderOpen,
  GraduationCap,
  Home,
  Inbox,
  LifeBuoy,
  LogOut,
  Menu,
  Settings,
  TableProperties,
  User,
  UserSquare2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrentTeacher } from "@/hooks/use-current-teacher";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/teacher", label: "Home", icon: Home },
  { href: "/teacher/students", label: "Students", icon: UserSquare2 },
  { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/teacher/grading", label: "Grading", icon: ClipboardCheck },
];

function isActiveTab(pathname: string, href: string): boolean {
  return href === "/teacher" ? pathname === "/teacher" : pathname.startsWith(href);
}

function badgeFor(href: string, pendingRequestCount: number, ungradedCount: number): number {
  if (href === "/teacher/requests") return pendingRequestCount;
  if (href === "/teacher/grading") return ungradedCount;
  return 0;
}

const MORE_SECTIONS: {
  heading: string;
  links: { href: string; label: string; icon: typeof Home; description: string }[];
}[] = [
  {
    heading: "Teaching",
    links: [
      { href: "/teacher/classes", label: "Classes", icon: Users, description: "Group classes and batches" },
      { href: "/teacher/requests", label: "Enrollment requests", icon: Inbox, description: "Accept or decline students" },
      { href: "/teacher/assignments", label: "Assignments", icon: ClipboardCheck, description: "Create and review work" },
      { href: "/teacher/gradebook", label: "Gradebook", icon: TableProperties, description: "Grades grid per class" },
      { href: "/teacher/schedule", label: "Schedule", icon: GraduationCap, description: "Sessions and meetings" },
      { href: "/teacher/materials", label: "Materials", icon: FolderOpen, description: "Worksheets and recordings" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/teacher/support", label: "Support", icon: LifeBuoy, description: "Raise and track requests" },
      { href: "/teacher/profile", label: "Profile", icon: User, description: "Bio, availability, notifications" },
    ],
  },
];

export function TeacherBottomTabs() {
  const pathname = usePathname();
  const { ungradedCount, pendingRequestCount } = useCurrentTeacher();
  const [moreOpen, setMoreOpen] = React.useState(false);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActiveTab(pathname, tab.href);
          const badge = badgeFor(tab.href, pendingRequestCount, ungradedCount);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              {tab.label}
              {badge > 0 ? (
                <span className="absolute right-[22%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Open more sections"
            >
              <Menu className="h-5 w-5" />
              More
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
            <SheetHeader className="px-4 pt-4 text-left">
              <SheetTitle className="text-base text-foreground">More</SheetTitle>
              <SheetDescription className="sr-only">
                Remaining teacher sections
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-1 overflow-y-auto px-3 pb-6">
              {MORE_SECTIONS.map((section) => (
                <div key={section.heading}>
                  <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.heading}
                  </p>
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const badge = badgeFor(link.href, pendingRequestCount, ungradedCount);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{link.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {link.description}
                          </span>
                        </span>
                        {badge > 0 ? (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            {badge}
                          </span>
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}

              <Separator className="my-2" />

              <Button
                type="button"
                variant="ghost"
                className="justify-start gap-3 px-3 py-3 text-sm font-medium text-destructive hover:text-destructive"
                onClick={() => setMoreOpen(false)}
              >
                <LogOut />
                Sign out (UI only)
              </Button>
              <p className="flex items-center gap-2 px-3 pb-2 text-xs text-muted-foreground">
                <Settings className="h-3.5 w-3.5" />
                Availability and notification settings are in Profile.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
