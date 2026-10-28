"use client";

import * as React from "react";
import { CalendarClock, Landmark, Mail, Phone } from "lucide-react";

import { RequestMeetingDialog } from "@/app/parent/meetings/request-meeting-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";

export function ParentSupportView() {
  const controller = useMockPageLoad();

  if (controller.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-72 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <ErrorState
        onRetry={controller.retry}
        description="We could not load support details. Please try again."
      />
    );
  }

  return <SupportContact />;
}

function SupportContact() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <SupportContactView dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
  );
}

function SupportContactView({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Support
        </h2>
        <p className="text-sm text-muted-foreground">
          How to reach the school about any question.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Landmark className="h-4 w-4 text-primary" />
            School contact
          </h3>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <ContactRow
            icon={Phone}
            label="Phone"
            value="+92 21 3456 7890"
            hint="Mon to Fri, during office hours"
          />
          <ContactRow
            icon={Mail}
            label="Email"
            value="office@vidyalayaschool.edu"
            hint="Replies within 1 working day"
          />
          <ContactRow
            icon={CalendarClock}
            label="Office hours"
            value="Mon-Fri · 9:00 AM - 4:00 PM"
            hint="Walk-ins: bring your parent ID"
          />
          <div className="flex flex-col justify-between gap-3 rounded-lg bg-accent/40 px-4 py-3">
            <div>
              <p className="text-xs font-medium text-foreground">
                Prefer to talk face to face?
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Request a meeting with one of your children&apos;s teachers.
              </p>
            </div>
            <Button type="button" onClick={() => setDialogOpen(true)}>
              <CalendarClock />
              Request a meeting
            </Button>
          </div>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Urgent safeguarding concerns are handled by the school administration phone
        line above.
      </p>

      <RequestMeetingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={() => undefined}
      />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
