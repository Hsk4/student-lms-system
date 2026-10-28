"use client";

import * as React from "react";
import { LifeBuoy, User } from "lucide-react";

import type { SupportTicket, TicketMessage } from "@/app/student/support/tickets-table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";

interface TicketConversationProps {
  ticket: SupportTicket;
}

export function TicketConversation({ ticket }: TicketConversationProps) {
  const [messages, setMessages] = React.useState<TicketMessage[]>(ticket.messages);
  const [reply, setReply] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSending, setIsSending] = React.useState(false);

  const isResolved = ticket.status === "resolved" || ticket.status === "closed";

  React.useEffect(() => {
    setMessages(ticket.messages);
  }, [ticket.id, ticket.messages]);

  const sendReply = () => {
    const content = reply.trim();
    if (!content) {
      setError("Type a reply before sending.");
      return;
    }
    setError(null);
    setIsSending(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `msg-${Date.now()}`,
          authorRole: "student",
          author: "Aditi Sharma",
          content,
          at: new Date().toISOString(),
        },
      ]);
      setReply("");
      setIsSending(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <MessagesTimeline messages={messages} />

      {isResolved ? (
        <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">
            This ticket is {ticket.status}. No more replies can be added.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Need something else? Open a new ticket from the support list.
          </p>
        </div>
      ) : null}

      {!isResolved ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto w-full max-w-[1100px]">
            {error ? (
              <p role="alert" className="mb-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            ) : null}
            <div className="flex items-end gap-2">
              <Textarea
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendReply();
                  }
                }}
                placeholder="Write a reply..."
                className="min-h-[52px] flex-1"
                aria-label="Reply to support"
                disabled={isSending}
              />
              <Button
                type="button"
                onClick={sendReply}
                disabled={isSending}
                aria-label="Send reply"
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MessagesTimeline({ messages }: { messages: TicketMessage[] }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => {
        const isStudent = message.authorRole === "student";
        return (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[85%] flex-col gap-1.5",
              isStudent ? "self-end items-end" : "self-start items-start",
            )}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  isStudent
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {isStudent ? (
                  <User className="h-3 w-3" />
                ) : (
                  <LifeBuoy className="h-3 w-3" />
                )}
              </span>
              <span className="font-medium text-foreground">
                {message.author}
              </span>
              <span>{formatDateTime(message.at)}</span>
            </div>
            <div
              className={cn(
                "whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                isStudent
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-secondary text-secondary-foreground",
              )}
            >
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
