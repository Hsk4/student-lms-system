"use client";

import * as React from "react";
import { CalendarClock, Inbox, TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import {
  getClassesForTeacher,
  getEnrollmentRequestHistory,
  getEnrollmentRequests,
} from "@/app/teacher/mock/data";
import type { EnrollmentRequest } from "@/app/teacher/mock/types";
import { formatDateOnly } from "@/lib/format";
import { DeclineDialog } from "@/app/teacher/requests/decline-dialog";
import { RequestDetailDrawer } from "@/app/teacher/requests/request-detail-drawer";

export function RequestsView() {
  const load = useMockPageLoad();
  const [tab, setTab] = React.useState<"pending" | "history">("pending");
  const [selected, setSelected] = React.useState<EnrollmentRequest | null>(null);
  const [declining, setDeclining] = React.useState<EnrollmentRequest | null>(null);
  const [decidedIds, setDecidedIds] = React.useState<string[]>([]);

  const pending = React.useMemo(
    () => getEnrollmentRequests().filter((request) => request.status === "pending" && !decidedIds.includes(request.id)),
    [decidedIds],
  );
  const history = React.useMemo(
    () => [
      ...getEnrollmentRequestHistory(),
      ...getEnrollmentRequests().filter((request) => decidedIds.includes(request.id)),
    ],
    [decidedIds],
  );
  const classes = React.useMemo(() => getClassesForTeacher("current"), []);

  const rows = tab === "pending" ? pending : history;

  const acceptIntoClass = (request: EnrollmentRequest, classId: string) => {
    // handleAcceptRequestIntoClass — replace with a real API call later.
    setDecidedIds((current) => [...current, request.id]);
    setSelected(null);
  };

  const acceptOneOnOne = (request: EnrollmentRequest) => {
    // handleAcceptOneOnOneRequest — replace with a real API call later.
    setDecidedIds((current) => [...current, request.id]);
    setSelected(null);
  };

  const decline = (request: EnrollmentRequest) => {
    // handleDeclineRequest — replace with a real API call later.
    setDecidedIds((current) => [...current, request.id]);
    setDeclining(null);
    setSelected(null);
  };

  if (load.isLoading) {
    return <LoadingSkeleton rows={6} columns={5} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load enrollment requests." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Enrollment Requests
          </h2>
          <p className="text-sm text-muted-foreground">
            Students who asked to study with you. Accept into a class or one-on-one.
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as "pending" | "history")}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 ? (
              <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {pending.length}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={tab === "pending" ? "No pending requests" : "No history yet"}
          description={
            tab === "pending"
              ? "New enrollment requests will appear here as they arrive."
              : "Accepted and declined requests move here once decided."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <ul className="divide-y divide-border/70">
            {rows.map((request) => (
              <li
                key={request.id}
                className="flex cursor-pointer flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:gap-4"
                onClick={() => tab === "pending" && setSelected(request)}
              >
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                    {request.studentName}
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                      {request.board.replace(" Board", "")} · {request.level}
                    </Badge>
                    {request.mismatch && request.status === "pending" ? (
                      <Badge variant="warning" className="gap-1 px-1.5 py-0 text-[10px]">
                        <TriangleAlert className="h-3 w-3" />
                        Mismatch
                      </Badge>
                    ) : null}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {request.requestedSubjects.join(", ")} ·{" "}
                    {request.message.length > 70 ? `${request.message.slice(0, 70)}…` : request.message}
                  </p>
                </div>

                <p className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatDateOnly(request.requestedAt)}
                </p>

                {tab === "pending" ? (
                  <div
                    className="flex shrink-0 flex-wrap gap-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(request)}
                    >
                      Review
                    </Button>
                  </div>
                ) : (
                  <div className="shrink-0">
                    <StatusBadge status={request.status} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant={load.simulateError ? "destructive" : "ghost"}
          size="sm"
          onClick={() => load.setSimulateError(!load.simulateError)}
          title="Dev toggle: simulate a failed request on next load"
        >
          Simulate error
        </Button>
      </div>

      <RequestDetailDrawer
        request={selected}
        classes={classes}
        onOpenChange={(open) => !open && setSelected(null)}
        onAcceptIntoClass={(classId) => selected && acceptIntoClass(selected, classId)}
        onAcceptOneOnOne={() => selected && acceptOneOnOne(selected)}
        onDecline={() => {
          if (selected) {
            setDeclining(selected);
          }
        }}
      />

      <DeclineDialog
        open={declining !== null}
        onOpenChange={(open) => !open && setDeclining(null)}
        studentName={declining?.studentName ?? ""}
        onDeclined={() => declining && decline(declining)}
      />
    </div>
  );
}
