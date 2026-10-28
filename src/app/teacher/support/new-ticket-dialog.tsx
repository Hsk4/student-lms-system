"use client";

import * as React from "react";
import { Loader2, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  "Technical bug",
  "Account",
  "Data correction",
  "Feature request",
  "Other",
];

interface NewTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillSubject?: string;
}

export function NewTicketDialog({
  open,
  onOpenChange,
  prefillSubject = "",
}: NewTicketDialogProps) {
  const [subject, setSubject] = React.useState(prefillSubject);
  const [category, setCategory] = React.useState<string>(CATEGORIES[0]);
  const [description, setDescription] = React.useState("");
  const [attachmentName, setAttachmentName] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<{
    subject?: string;
    description?: string;
  }>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setSubject(prefillSubject);
      setCategory(CATEGORIES[0]);
      setDescription("");
      setAttachmentName(null);
      setErrors({});
      setSent(false);
      setSubmitting(false);
    }
  }, [open, prefillSubject]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (subject.trim().length < 4) {
      nextErrors.subject = "Give the ticket a short clear subject.";
    }
    if (description.trim().length < 10) {
      nextErrors.description = "Describe the issue in at least 10 characters.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // handleCreateTicket — replace with a real API call later.
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      window.setTimeout(() => onOpenChange(false), 900);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              ✓
            </span>
            <p className="text-base font-semibold text-foreground">Ticket created</p>
            <p className="text-sm text-muted-foreground">
              The school team will reply in this thread.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <DialogHeader>
              <DialogTitle>New support ticket</DialogTitle>
              <DialogDescription>
                The school team replies in the ticket thread.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="ticket-subject">Subject</Label>
                <Input
                  id="ticket-subject"
                  value={subject}
                  onChange={(event) => {
                    setSubject(event.target.value);
                    setErrors((current) => ({ ...current, subject: undefined }));
                  }}
                  placeholder="Short summary of the issue"
                  aria-invalid={errors.subject ? true : undefined}
                />
                {errors.subject ? (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {errors.subject}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger aria-label="Category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ticket-description">Description</Label>
                <Textarea
                  id="ticket-description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setErrors((current) => ({ ...current, description: undefined }));
                  }}
                  rows={4}
                  placeholder="What happened? Which class or page is affected?"
                  aria-invalid={errors.description ? true : undefined}
                />
                {errors.description ? (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {errors.description}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label>Attachment (optional)</Label>
                {attachmentName ? (
                  <p className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm text-foreground">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    {attachmentName}
                  </p>
                ) : (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-secondary">
                    <Paperclip className="h-4 w-4" />
                    Attach a screenshot or file (UI only)
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(event) =>
                        setAttachmentName(event.target.files?.[0]?.name ?? null)
                      }
                    />
                  </label>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create ticket"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
