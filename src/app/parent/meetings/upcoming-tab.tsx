"use client";

import * as React from "react";
import { CalendarClock, Monitor, Video } from "lucide-react";

import { getUpcomingMeetingsForChild } from "@/app/parent/mock/data";
import { ChildTagBadge } from "@/app/parent/parent-home";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { useCurrentParent } from "@/hooks/use-current-parent";

export function UpcomingMeetingsTab() {
  const { scopedChildId } = useCurrentParent();
  const meetings = React.useMemo(
    () => getUpcomingMeetingsForChild(scopedChildId),
    [scopedChildId],
  );

  if (meetings.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="No meetings scheduled."
        description="Accepted meeting requests will show up here with their join link."
        className="rounded-xl"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border/70">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <CalendarClock className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {meeting.topic}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(meeting.scheduledAt)} · {meeting.teacherName}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-primary">
                <Video className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Join link: {meeting.joinLink.replace("https://", "")}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              <ChildTagBadge childId={meeting.childId} />
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                <Monitor className="mr-1 h-3 w-3" />
                {meeting.location}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
