"use client";

import * as React from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SupportTicket } from "@/app/student/support/tickets-table";
import { dateIn } from "@/lib/format";

interface NewTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (ticket: SupportTicket) => void;
}

export function NewTicketDialog({
  open,
  onOpenChange,
  onCreated,
}: NewTicketDialogProps) {
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{
    subject?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const reset = () => {
    setSubject("");
    setMessage("");
    setErrors({});
    setIsSubmitting(false);
  };

  const handleSubmit = () => {
    const nextErrors: { subject?: string; message?: string } = {};
    if (!subject.trim()) {
      nextErrors.subject = "Add a short subject so we know what this is about.";
    }
    if (!message.trim()) {
      nextErrors.message = "Describe the problem in a sentence or two.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      onCreated({
        id: `tkt-${Math.floor(400 + Math.random() * 500)}`,
        subject: subject.trim(),
        status: "open",
        createdAt: dateIn(0, 12, 0),
        lastUpdate: dateIn(0, 12, 0),
        messages: [
          {
            id: `msg-${Date.now()}`,
            authorRole: "student",
            author: "Aditi Sharma",
            content: message.trim(),
            at: dateIn(0, 12, 0),
          },
        ],
      });
      reset();
      onOpenChange(false);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New support ticket</DialogTitle>
          <DialogDescription>
            The support team replies here in the ticket conversation, usually
            within one school day.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="ticket-subject"
              className={
                errors.subject ? "text-red-700 dark:text-red-300" : undefined
              }
            >
              Subject
            </Label>
            <Input
              id="ticket-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Summary of the problem"
              disabled={isSubmitting}
            />
            {errors.subject ? (
              <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                {errors.subject}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="ticket-message"
              className={
                errors.message ? "text-red-700 dark:text-red-300" : undefined
              }
            >
              Message
            </Label>
            <Textarea
              id="ticket-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe what happened and what you expected instead..."
              disabled={isSubmitting}
            />
            {errors.message ? (
              <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                {errors.message}
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            <Send />
            {isSubmitting ? "Opening ticket..." : "Open ticket"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
