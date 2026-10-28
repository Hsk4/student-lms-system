"use client";

import * as React from "react";
import { CalendarClock, Check, X } from "lucide-react";

import { getMeetingRequestsForChild } from "@/app/parent/mock/data";
import type { MeetingRequest } from "@/app/parent/mock/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { useCurrentParent } from "@/hooks/use-current-parent";
import type { MeetingStatus } from "@/app/parent/mock/types";

export function MeetingRequestsTab() {
  const { scopedChildId } = useCurrentParent();
  const initial = React.useMemo(
    () => getMeetingRequestsForChild(scopedChildId),
    [scopedChildId],
  );

  const [requests, setRequests] = React.useState<MeetingRequest[]>(initial);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRequests(getMeetingRequestsForChild(scopedChildId));
  }, [scopedChildId]);

  const updateStatus = (id: string, status: MeetingStatus) => {
    setBusyId(id);
    window.setTimeout(() => {
      setBusyId(null);
      setRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, status } : request,
        ),
      );
    }, 600);
  };

  const cancel = (id: string) => updateStatus(id, "declined");

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="No meeting requests."
        description="Requests you send will sit here until the teacher responds."
        className="rounded-xl"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border/70">
        {requests.map((request) => (
          <li key={request.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <CalendarClock className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {request.topic}
              </p>
              <p className="text-xs text-muted-foreground">
                {request.teacherName} · {formatDateTime(request.requestedFor)}
                {request.notes ? ` · “${request.notes}”` : ""}
              </p>
              {request.status === "rescheduled" && request.proposedTime ? (
                <p className="mt-1 text-xs font-medium text-primary">
                  Teacher proposed: {formatDateTime(request.proposedTime)}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <StatusPill status={request.status} />
              {request.status === "rescheduled" ? (
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    disabled={busyId === request.id}
                    onClick={() => updateStatus(request.id, "confirmed")}
                  >
                    <Check />
                    Accept
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busyId === request.id}
                    onClick={() => updateStatus(request.id, "declined")}
                  >
                    <X />
                    Decline
                  </Button>
                </div>
              ) : null}
              {request.status === "pending" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyId === request.id}
                  onClick={() => cancel(request.id)}
                >
                  <X />
                  Cancel
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusPill({ status }: { status: MeetingRequest["status"] }) {
  const styles: Record<MeetingRequest["status"], string> = {
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    confirmed:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    rescheduled:
      "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    declined:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
