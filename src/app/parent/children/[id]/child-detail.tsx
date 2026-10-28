"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { ChildHeaderCard } from "@/app/parent/children/[id]/child-header-card";
import { ChildTabs } from "@/app/parent/children/[id]/child-tabs";
import { getChildById } from "@/app/parent/mock/data";
import type { MeetingRequestSubmit } from "@/app/parent/meetings/request-meeting-dialog";
import { RequestMeetingDialog } from "@/app/parent/meetings/request-meeting-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";

export function ChildDetailPage({ childId }: { childId: string }) {
  const controller = useMockPageLoad();

  if (controller.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-10 w-96 rounded-lg" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <ErrorState
        onRetry={controller.retry}
        description="We could not load this child's details. Please try again."
      />
    );
  }

  const child = getChildById(childId);

  if (!child) {
    return (
      <EmptyState
        title="Child not linked"
        description="This child is not linked to your parent account anymore."
      />
    );
  }

  return <ChildDetailContent childId={childId} />;
}

function ChildDetailContent({ childId }: { childId: string }) {
  const child = getChildById(childId)!;
  const childName = child.name;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [requestedBanner, setRequestedBanner] = React.useState<string | null>(null);

  const handleSubmitted = (request: MeetingRequestSubmit) => {
    setRequestedBanner(
      `Meeting request sent to ${request.teacherName} for ${request.slotLabel}.`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <Link href="/parent/children" className="hover:underline hover:text-foreground">
          Children
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{childName}</span>
      </nav>

      {requestedBanner ? (
        <div
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {requestedBanner}
        </div>
      ) : null}

      <ChildHeaderCard childId={childId} onRequestMeeting={() => setDialogOpen(true)} />

      <ChildTabs childId={childId} onRequestMeeting={() => setDialogOpen(true)} />

      <RequestMeetingDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setRequestedBanner(null);
        }}
        prefill={{ childId }}
        onSubmit={handleSubmitted}
      />
    </div>
  );
}
