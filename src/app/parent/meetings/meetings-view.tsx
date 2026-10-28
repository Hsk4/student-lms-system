"use client";

import * as React from "react";
import { CalendarClock, CircleCheck } from "lucide-react";

import { MeetingRequestsTab } from "@/app/parent/meetings/requests-tab";
import { PastMeetingsTab } from "@/app/parent/meetings/past-tab";
import { RequestMeetingDialog } from "@/app/parent/meetings/request-meeting-dialog";
import type { MeetingRequestSubmit } from "@/app/parent/meetings/request-meeting-dialog";
import { UpcomingMeetingsTab } from "@/app/parent/meetings/upcoming-tab";
import { getMeetingRequestsForChild } from "@/app/parent/mock/data";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { useCurrentParent } from "@/hooks/use-current-parent";

export function MeetingsView() {
  const controller = useMockPageLoad();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toastText, setToastText] = React.useState<string | null>(null);

  if (controller.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-72 rounded-xl" />
        <Skeleton className="h-10 w-80 rounded-lg" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <ErrorState
        onRetry={controller.retry}
        description="We could not load meetings. Please try again."
      />
    );
  }

  return (
    <MeetingScopesWithToast
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      toastText={toastText}
      setToastText={setToastText}
    />
  );
}

function MeetingScopesWithToast({
  dialogOpen,
  setDialogOpen,
  toastText,
  setToastText,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  toastText: string | null;
  setToastText: (text: string | null) => void;
}) {
  const { scopedChildId, selectedChild } = useCurrentParent();
  const requests = React.useMemo(
    () => getMeetingRequestsForChild(scopedChildId),
    [scopedChildId],
  );

  const handleSubmit = (request: MeetingRequestSubmit) => {
    setToastText(
      `Request sent to ${request.teacherName} for ${request.slotLabel}.`,
    );
  };

  const prefill = selectedChild ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Meetings
          </h2>
          <p className="text-sm text-muted-foreground">
            On-the-record conversations about your children.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => setDialogOpen(true)}
          >
            <CalendarClock />
            Request meeting
          </Button>
        </div>
      </div>

      {toastText ? (
        <div
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          role="status"
        >
          <CircleCheck className="h-4 w-4 shrink-0" />
          {toastText}
        </div>
      ) : null}

      <Tabs defaultValue="upcoming" className="flex min-w-0 flex-col gap-4">
        <TabsList aria-label="Meeting tabs">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.length > 0 ? (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                {requests.length}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <UpcomingMeetingsTab />
        </TabsContent>
        <TabsContent value="requests">
          <MeetingRequestsTab />
        </TabsContent>
        <TabsContent value="past">
          <PastMeetingsTab />
        </TabsContent>
      </Tabs>

      <RequestMeetingDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setToastText(null);
        }}
        prefill={
          prefill
            ? {
                childId: prefill.id,
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
}
