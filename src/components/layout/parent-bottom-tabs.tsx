"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  ChevronRight,
  Home,
  LifeBuoy,
  LogOut,
  Menu,
  Receipt,
  Settings,
  User,
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
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/parent", label: "Home", icon: Home },
  { href: "/parent/children", label: "Children", icon: Users },
  { href: "/parent/fees", label: "Fees", icon: Receipt },
  { href: "/parent/meetings", label: "Meetings", icon: CalendarClock },
];

function isActiveTab(pathname: string, href: string): boolean {
  return href === "/parent" ? pathname === "/parent" : pathname.startsWith(href);
}

export function ParentBottomTabs() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  const moreLinks = [
    { href: "/parent/support", label: "Support", icon: LifeBuoy, description: "School contact details" },
    { href: "/parent/profile", label: "Profile", icon: User, description: "Account and notifications" },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActiveTab(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              {tab.label}
            </Link>
          );
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Open more options"
            >
              <Menu className="h-5 w-5" />
              More
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader className="px-4 pt-4 text-left">
              <SheetTitle className="text-base text-foreground">More</SheetTitle>
              <SheetDescription className="sr-only">
                Support, profile and account actions
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-3 pb-6">
              {moreLinks.map((link) => {
                const Icon = link.icon;
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                );
              })}

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
                Notification settings are in Profile.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
