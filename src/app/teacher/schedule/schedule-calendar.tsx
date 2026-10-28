"use client";

import * as React from "react";
import {
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Users,
  Video,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMeetingRequests, getScheduleEvents, getScheduleEventsForDate } from "@/app/teacher/mock/data";
import type { MeetingRequest, ScheduleEvent } from "@/app/teacher/mock/types";
import { formatDateOnly, formatTimeOnly } from "@/lib/format";
import { cn } from "@/lib/utils";

const KIND_META = {
  class: { label: "Class", icon: Users, dot: "bg-primary" },
  "one-on-one": { label: "One-on-one", icon: CalendarClock, dot: "bg-amber-500" },
  meeting: { label: "Parent meeting", icon: Video, dot: "bg-sky-500" },
} as const;

export function ScheduleCalendar() {
  const [view, setView] = React.useState<"day" | "week" | "month">("day");
  const [cursor, setCursor] = React.useState(() => new Date());

  const events = React.useMemo(() => getScheduleEvents(), []);
  const dayEvents = React.useMemo(() => getScheduleEventsForDate(cursor), [cursor]);

  const addDays = (days: number) => {
    setCursor((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + days);
      return next;
    });
  };

  const shift = (direction: 1 | -1) => {
    if (view === "day") addDays(direction);
    else if (view === "week") addDays(direction * 7);
    else
      setCursor((current) => {
        const next = new Date(current);
        next.setMonth(next.getMonth() + direction);
        return next;
      });
  };

  const now = Date.now();

  return (
    <Card>
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={view} onValueChange={(value) => setView(value as "day" | "week" | "month")}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button type="button" variant="outline" size="sm" onClick={() => setCursor(new Date())}>
            Today
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shift(-1)} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="min-w-[130px] text-center text-sm font-medium text-foreground">
            {formatDateOnly(cursor)}
          </p>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shift(1)} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap gap-3">
          {Object.entries(KIND_META).map(([kind, meta]) => (
            <span key={kind} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-secondary border border-border" />
            Available hours (shaded)
          </span>
        </div>

        {view === "day" ? (
          dayEvents.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nothing scheduled for this day.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {dayEvents.map((event) => (
                <EventRow key={event.id} event={event} isNow={now >= new Date(event.startsAt).getTime() && now <= new Date(event.endsAt).getTime()} isPast={now > new Date(event.endsAt).getTime()} />
              ))}
            </ul>
          )
        ) : (
          <MonthGrid cursor={cursor} events={events} onPickDay={(date) => { setCursor(date); setView("day"); }} />
        )}
      </CardContent>
    </Card>
  );
}

function EventRow({ event, isNow, isPast }: { event: ScheduleEvent; isNow: boolean; isPast: boolean }) {
  const meta = KIND_META[event.kind];
  const Icon = meta.icon;
  return (
    <li className={cn("rounded-xl border p-3.5", isPast ? "border-border bg-secondary/30 opacity-70" : isNow ? "border-primary/50 bg-accent/50" : "border-border bg-card")}>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="flex w-full items-center gap-3 text-left">
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary")}>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{event.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{event.subtitle}</span>
            </span>
            <span className="shrink-0 text-xs font-medium text-foreground">
              {formatTimeOnly(event.startsAt)} – {formatTimeOnly(event.endsAt)}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">{event.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateOnly(event.startsAt)} · {formatTimeOnly(event.startsAt)} – {formatTimeOnly(event.endsAt)}
            </p>
            {event.location ? (
              <p className="text-xs text-muted-foreground">Location: {event.location}</p>
            ) : null}
            <div className="mt-1 flex flex-wrap gap-1.5">
              {event.classId ? (
                <Button asChild size="sm" variant="outline">
                  <a href={`/teacher/classes/${event.classId}`}>Open class</a>
                </Button>
              ) : null}
              {event.kind !== "meeting" ? (
                <Button asChild size="sm" variant="outline">
                  <a href="/teacher/attendance">Take attendance</a>
                </Button>
              ) : null}
              {event.joinLink ? (
                <Button asChild size="sm">
                  <a href={event.joinLink} target="_blank" rel="noreferrer">
                    <Video />
                    Join
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </li>
  );
}

function MonthGrid({
  cursor,
  events,
  onPickDay,
}: {
  cursor: Date;
  events: ScheduleEvent[];
  onPickDay: (date: Date) => void;
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toDateString();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
  ];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
          <p key={label} className="pb-1 text-center text-[11px] font-medium text-muted-foreground">
            {label}
          </p>
        ))}
        {cells.map((date, index) => {
          if (date === null) return <span key={`pad-${index}`} />;
          const dayEvents = events.filter(
            (event) => event.startsAt.slice(0, 10) === date.toISOString().slice(0, 10),
          );
          const isToday = date.toDateString() === todayKey;
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onPickDay(date)}
              className={cn(
                "flex min-h-[72px] flex-col gap-1 rounded-lg border border-border bg-card p-1.5 text-left transition-colors hover:bg-secondary/50",
                isToday && "border-primary",
              )}
            >
              <span className={cn("text-xs font-medium", isToday ? "text-primary" : "text-foreground")}>
                {date.getDate()}
              </span>
              <span className="flex flex-wrap gap-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className={cn("h-1.5 w-1.5 rounded-full", KIND_META[event.kind].dot)}
                    title={event.title}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MeetingRequestsPanel() {
  const [requests, setRequests] = React.useState<MeetingRequest[]>(() => getMeetingRequests());
  const pending = requests.filter((request) => request.status === "pending");

  const act = (id: string, status: MeetingRequest["status"]) => {
    // handleMeetingRequestDecision — replace with a real API call later.
    setRequests((current) =>
      current.map((request) => (request.id === id ? { ...request, status } : request)),
    );
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Meeting requests</CardTitle>
        {pending.length > 0 ? <Badge variant="accent">{pending.length} pending</Badge> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {requests.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No meeting requests right now.
          </p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-border p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{request.parentName}</p>
                <Badge
                  variant={
                    request.status === "pending"
                      ? "warning"
                      : request.status === "confirmed"
                        ? "success"
                        : "secondary"
                  }
                >
                  {request.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {request.studentName} · {request.topic}
              </p>
              {request.proposedTimes.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1">
                  {request.proposedTimes.map((time) => (
                    <li key={time} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {formatDateOnly(time)}, {formatTimeOnly(time)}
                    </li>
                  ))}
                </ul>
              ) : null}
              {request.note ? (
                <p className="mt-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs italic text-muted-foreground">
                  &ldquo;{request.note}&rdquo;
                </p>
              ) : null}
              {request.status === "pending" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" onClick={() => act(request.id, "confirmed")}>
                    <Check />
                    Confirm
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => act(request.id, "pending")}>
                    Propose new time
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => act(request.id, "declined")}
                  >
                    <X />
                    Decline
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
