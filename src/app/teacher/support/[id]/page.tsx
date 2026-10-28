"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Send } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getSupportTickets } from "@/app/teacher/mock/data";
import type { TicketMessage } from "@/app/teacher/mock/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function TeacherTicketThreadPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params?.id ?? "";
  const load = useMockPageLoad();
  const [replies, setReplies] = React.useState<TicketMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const ticket = React.useMemo(
    () => getSupportTickets().find((item) => item.id === ticketId),
    [ticketId],
  );

  const messages = React.useMemo(
    () =>
      ticket
        ? [...ticket.messages, ...replies].sort((a, b) => a.at.localeCompare(b.at))
        : [],
    [ticket, replies],
  );

  const handleSendReply = () => {
    const text = draft.trim();
    if (!text) return;
    // handleSendTicketReply — replace with a real API call later.
    setSending(true);
    window.setTimeout(() => {
      setReplies((current) => [
        ...current,
        {
          id: `local-${current.length + 1}`,
          author: "teacher",
          text,
          at: new Date().toISOString(),
        },
      ]);
      setDraft("");
      setSending(false);
    }, 600);
  };

  if (load.isLoading) {
    return <LoadingSkeleton rows={5} columns={2} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load this ticket." />;
  }

  if (!ticket) {
    return (
      <ErrorState
        title="Ticket not found"
        description="This ticket may have been closed or removed."
        onRetry={() => window.history.back()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          href="/teacher/support"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to support
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {ticket.subject}
          </h2>
          <StatusBadge status={ticket.status} />
          {ticket.escalated ? (
            <Badge variant="warning" className="px-1.5 py-0 text-[10px]">
              Escalated
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {ticket.category} · Opened {formatDateTime(ticket.createdAt)} · Last update{" "}
          {formatDateTime(ticket.updatedAt)}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
        {messages.map((message) => {
          const mine = message.author === "teacher";
          return (
            <div
              key={message.id}
              className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  mine
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border border-border bg-secondary/60 text-foreground",
                )}
              >
                {message.text}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {mine ? "You" : "Support team"} · {formatDateTime(message.at)}
              </p>
            </div>
          );
        })}
      </div>

      {ticket.status === "open" ? (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Write a reply…"
            aria-label="Reply"
          />
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              onClick={handleSendReply}
              disabled={sending || draft.trim().length === 0}
            >
              {sending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
              ) : (
                <Send />
              )}
              {sending ? "Sending…" : "Send reply"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-emerald-600" />
          This ticket is resolved. Replies are closed.
        </p>
      )}
    </div>
  );
}
