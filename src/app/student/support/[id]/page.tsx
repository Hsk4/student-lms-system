"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LifeBuoy } from "lucide-react";

import {
  MOCK_SUPPORT_TICKETS,
} from "@/app/student/support/tickets-table";
import { TicketConversation } from "@/app/student/support/[id]/ticket-conversation";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { formatDateOnly, formatDateTime } from "@/lib/format";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const controller = useMockPageLoad();

  const ticket = MOCK_SUPPORT_TICKETS.find((item) => item.id === params?.id);

  if (controller.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return <ErrorState onRetry={controller.retry} />;
  }

  if (!ticket) {
    return (
      <EmptyState
        title="Ticket not found"
        description="This ticket may have been closed and removed, or the link is incorrect."
        icon={LifeBuoy}
        action={
          <Button asChild variant="outline">
            <Link href="/student/support">Back to support</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/student/support">
          <ArrowLeft />
          Back to support
        </Link>
      </Button>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {ticket.subject}
          </h2>
          <p className="text-sm text-muted-foreground">
            Opened {formatDateOnly(ticket.createdAt)} · Last update{" "}
            {formatDateTime(ticket.lastUpdate)}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <TicketConversation ticket={ticket} />
    </div>
  );
}
