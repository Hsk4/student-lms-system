"use client";

import * as React from "react";
import { Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface DeclineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  onDeclined?: () => void;
}

export function DeclineDialog({ open, onOpenChange, studentName, onDeclined }: DeclineDialogProps) {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (reason.trim().length < 10) {
      setError("Add a short reason so the parent understands (min 10 characters).");
      return;
    }
    setError(null);
    setSubmitting(true);
    // handleDeclineRequest — replace with a real API call later.
    window.setTimeout(() => {
      setSubmitting(false);
      onDeclined?.();
      onOpenChange(false);
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4 text-destructive" />
              Decline request
            </DialogTitle>
            <DialogDescription>
              Decline {studentName}&apos;s enrollment request. The parent will see your reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            <Textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setError(null);
              }}
              rows={3}
              placeholder="e.g. My Grade 10 ICSE batch is full this term."
              aria-invalid={error ? true : undefined}
            />
            {error ? (
              <p className="text-xs font-medium text-destructive" role="alert">{error}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Declining…" : "Decline request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
