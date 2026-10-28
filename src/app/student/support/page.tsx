"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";

import { MOCK_SUPPORT_TICKETS } from "@/app/student/support/tickets-table";
import { TicketsTable, type SupportTicket } from "@/app/student/support/tickets-table";
import { NewTicketDialog } from "@/app/student/support/new-ticket-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";

export default function SupportPage() {
  const controller = useMockPageLoad();
  const [tickets, setTickets] = React.useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleCreated = (ticket: SupportTicket) => {
    setTickets((current) => [ticket, ...current]);
  };

  if (controller.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Support
        </h2>
        <ErrorState onRetry={controller.retry} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Support
          </h2>
          <p className="text-sm text-muted-foreground">
            Questions about classes, fees or the platform itself.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => setDialogOpen(true)}
          >
            <PlusCircle />
            New ticket
          </Button>
        </div>
      </div>

      <TicketsTable tickets={tickets} />

      <NewTicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}
