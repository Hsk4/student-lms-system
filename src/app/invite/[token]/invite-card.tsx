"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Send,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type InviteDemoCase =
  | "valid"
  | "sent"
  | "invalid_token"
  | "used_token"
  | "already_signed_in";

const STUDENT_NAME = "Aditi Sharma";
const PREFILLED_EMAIL = "kavita.sharma@example.com";

const CASE_OPTIONS: { value: InviteDemoCase; label: string }[] = [
  { value: "valid", label: "Valid invite (default)" },
  { value: "sent", label: "Accepted / signed up" },
  { value: "invalid_token", label: "Invalid token" },
  { value: "used_token", label: "Expired / used token" },
  { value: "already_signed_in", label: "Already signed in" },
];

export function InviteAcceptCard() {
  const [demoCase, setDemoCase] = React.useState<InviteDemoCase>("valid");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAccept = () => {
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setDemoCase("sent");
    }, 900);
  };

  const handleDemoCaseChange = (value: string) => {
    setIsSubmitting(false);
    setDemoCase(value as InviteDemoCase);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <Label className="text-xs" htmlFor="invite-case">
          Demo view (UI only)
        </Label>
        <Select value={demoCase} onValueChange={handleDemoCaseChange}>
          <SelectTrigger id="invite-case" className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CASE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <InviteBody demoCase={demoCase} submitBusy={isSubmitting} onAccept={handleAccept} />
    </div>
  );
}

function InviteBody({
  demoCase,
  submitBusy,
  onAccept,
}: {
  demoCase: InviteDemoCase;
  submitBusy: boolean;
  onAccept: () => void;
}) {
  if (demoCase === "already_signed_in") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <UserPlus className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          Sign out to accept this invite
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You are currently signed in with another role. Sign out, then open this
          invite link again to accept it as a parent.
        </p>
        <div className="mt-5 space-y-2">
          <Button asChild type="button" variant="outline" className="w-full">
            <Link href="/admin">Go to admin console</Link>
          </Button>
          <Button asChild type="button" variant="ghost" className="w-full">
            <Link href="/student">Go to student panel</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (demoCase === "invalid_token" || demoCase === "used_token") {
    const reason =
      demoCase === "used_token"
        ? "This invite has already been used or has expired."
        : "This invite link is not valid.";

    return (
      <div
        className="rounded-xl border border-red-200 bg-red-50/60 p-6 text-center shadow-sm dark:border-red-900/60 dark:bg-red-950/30"
        role="alert"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          Invite problem
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{reason}</p>
        <p className="mt-3 text-sm font-medium text-foreground">
          Ask your child to send a new invite.
        </p>
      </div>
    );
  }

  if (demoCase === "sent") {
    return (
      <SignedUpCard />
    );
  }

  return <ValidInviteForm submitBusy={submitBusy} onAccept={onAccept} />;
}

function SignedUpCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
        You&apos;re all set
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Kavita Sharma is signed up and can now follow {STUDENT_NAME}&apos;s
        progress.
      </p>
      <Button asChild type="button" className="mt-5 w-full">
        <Link href="/parent">Open parent dashboard</Link>
      </Button>
    </div>
  );
}

function ValidInviteForm({
  submitBusy,
  onAccept,
}: {
  submitBusy: boolean;
  onAccept: () => void;
}) {
  const email = PREFILLED_EMAIL;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!submitBusy) onAccept();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
      noValidate
    >
      <div className="text-center">
        <Badge variant="accent" className="mb-3">
          Parent invite
        </Badge>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {STUDENT_NAME} invited you to follow their progress
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Parents can see grades, attendance and fees.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="invite-name">Your name</Label>
          <Input
            id="invite-name"
            value="Kavita Sharma"
            readOnly
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invite-email">Email</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="invite-email"
              value={email}
              disabled
              readOnly
              className="cursor-not-allowed bg-secondary/60 pl-9 text-muted-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Pre-filled from the invite. Ask your child for changes.
          </p>
        </div>
      </div>

      <Button type="submit" className="mt-6 w-full" disabled={submitBusy}>
        {submitBusy ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
            Creating account...
          </>
        ) : (
          <>
            <Send />
            Create account
          </>
        )}
      </Button>
    </form>
  );
}
