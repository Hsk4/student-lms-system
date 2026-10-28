"use client";

import * as React from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

import { MeetingRequestsPanel, ScheduleCalendar } from "@/app/teacher/schedule/schedule-calendar";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";

export function ScheduleView() {
  const load = useMockPageLoad();
  const [panelOpen, setPanelOpen] = React.useState(true);

  if (load.isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[70fr_30fr]">
        <div className="h-96 animate-pulse rounded-xl bg-secondary" />
        <div className="h-96 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load your schedule." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Sessions, one-on-ones and parent meetings in one calendar.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPanelOpen((open) => !open)}
          className="w-full sm:w-auto"
        >
          {panelOpen ? <PanelRightClose /> : <PanelRightOpen />}
          {panelOpen ? "Hide requests" : "Show requests"}
        </Button>
      </div>

      <div className={panelOpen ? "grid gap-4 xl:grid-cols-[70fr_30fr]" : ""}>
        <ScheduleCalendar />
        {panelOpen ? <MeetingRequestsPanel /> : null}
      </div>

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
    </div>
  );
}
