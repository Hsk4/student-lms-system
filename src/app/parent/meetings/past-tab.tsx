"use client";

import * as React from "react";
import { CalendarCheck, StickyNote } from "lucide-react";

import { getPastMeetingsForChild } from "@/app/parent/mock/data";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime } from "@/lib/format";
import { useCurrentParent } from "@/hooks/use-current-parent";

export function PastMeetingsTab() {
  const { scopedChildId } = useCurrentParent();
  const meetings = React.useMemo(
    () => getPastMeetingsForChild(scopedChildId),
    [scopedChildId],
  );

  if (meetings.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No past meetings."
        description="Completed meetings and their notes will appear here."
        className="rounded-xl"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border/70">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{meeting.topic}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(meeting.heldAt)}
              </p>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {meeting.teacherName} · {meeting.childName}
            </p>
            {meeting.notes ? (
              <p className="mt-2.5 flex items-start gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>
                  <span className="font-medium text-foreground">Teacher notes: </span>
                  {meeting.notes}
                </span>
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
