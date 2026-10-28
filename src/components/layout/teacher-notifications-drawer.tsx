"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  CheckCheck,
  ClipboardCheck,
  Inbox,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getTeacherNotifications } from "@/app/teacher/mock/data";
import type { TeacherNotification } from "@/app/teacher/mock/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  request: Inbox,
  submission: ClipboardCheck,
  meeting: CalendarClock,
  support: Bell,
} as const;

const KIND_TAG_OPTIONS = [
  { value: "all", label: "All activity" },
  { value: "Request", label: "Students" },
  { value: "Classes", label: "Classes" },
  { value: "Assignments", label: "Assignments" },
  { value: "Grading", label: "Grading" },
  { value: "Schedule", label: "Schedule" },
  { value: "Support", label: "Support" },
];

function relativeTime(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/**
 * Teacher notifications drawer — follows the shared notifications-drawer
 * pattern (Today/Earlier groups, mark all read, deep links) but is scoped
 * to teacher mock data so the parent/ shared file stays untouched.
 */
export function TeacherNotificationsDrawer() {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<string>("all");
  const [readIds, setReadIds] = React.useState<string[]>([]);

  const allNotifications = React.useMemo(() => getTeacherNotifications(), []);

  const notifications = React.useMemo(() => {
    if (filter === "all") return allNotifications;
    return allNotifications.filter((item) => item.tag === filter);
  }, [allNotifications, filter]);

  const isUnread = (notification: TeacherNotification) =>
    !notification.read && !readIds.includes(notification.id);

  const unreadCount = allNotifications.filter(isUnread).length;

  const handleMarkAllRead = () => {
    setReadIds((current) => [
      ...current,
      ...allNotifications.filter(isUnread).map((item) => item.id),
    ]);
  };

  const groups: { label: string; items: TeacherNotification[] }[] = [
    {
      label: "Today",
      items: notifications.filter(
        (item) =>
          new Date(item.occurredAt).toDateString() === new Date().toDateString(),
      ),
    },
    {
      label: "Earlier",
      items: notifications.filter(
        (item) =>
          new Date(item.occurredAt).toDateString() !== new Date().toDateString(),
      ),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative h-10 w-10 shrink-0"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-0 right-0 h-full w-full border-l p-0 sm:max-w-md sm:w-[420px]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border bg-card px-4 py-4">
            <SheetTitle className="flex items-center gap-2 text-base text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </SheetTitle>
            <SheetDescription className="sr-only">
              Enrollment requests, submissions, meetings and support updates
            </SheetDescription>
          </SheetHeader>

          <div className="flex items-center justify-between gap-2 border-b border-border bg-card px-4 py-2.5">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-8 w-[170px]" aria-label="Filter notifications">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KIND_TAG_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck />
              Mark all read
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground">
                  New activity in your classes will appear here.
                </p>
              </div>
            ) : (
              groups.map((group) => (
                <section key={group.label}>
                  <h3 className="bg-secondary/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </h3>
                  <ul className="divide-y divide-border/70">
                    {group.items.map((notification) => {
                      const Icon = KIND_ICON[notification.kind];
                      const unread = isUnread(notification);
                      return (
                        <li key={notification.id}>
                          <SheetClose asChild>
                            <Link
                              href={notification.href}
                              className={cn(
                                "flex gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/50",
                                unread && "bg-accent/40",
                              )}
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm leading-snug text-foreground">
                                  {notification.text}
                                </span>
                                <span className="mt-1 flex flex-wrap items-center gap-2">
                                  <Badge variant="accent" className="px-1.5 py-0 text-[10px]">
                                    {notification.tag}
                                  </Badge>
                                  <span className="text-[11px] text-muted-foreground">
                                    {relativeTime(notification.occurredAt)} ·{" "}
                                    {formatDateTime(notification.occurredAt)}
                                  </span>
                                </span>
                              </span>
                              {unread ? (
                                <span
                                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                                  aria-hidden
                                />
                              ) : null}
                            </Link>
                          </SheetClose>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
