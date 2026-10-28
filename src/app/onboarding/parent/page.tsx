"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Mail,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_STUDENT } from "@/hooks/use-current-student";

type InviteStage = "form" | "sending" | "sent";

interface ParentInviteValidation {
  name?: string;
  email?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateInvite(name: string, email: string): ParentInviteValidation {
  const errors: ParentInviteValidation = {};
  if (!name.trim()) {
    errors.name = "Add your parent's or guardian's name.";
  }
  if (!email.trim()) {
    errors.email = "Add an email address so the invite can be delivered.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "That does not look like a valid email address.";
  } else if (email.trim().includes("exists")) {
    errors.email = "This email already has an account. Ask them to sign in instead.";
  } else if (email.trim().includes("fail")) {
    errors.email = "We could not send the invite. Check the address and try again.";
  }
  return errors;
}

export default function OnboardingParentPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<ParentInviteValidation>({});
  const [stage, setStage] = React.useState<InviteStage>("form");
  const [isResending, setIsResending] = React.useState(false);
  const [resendNote, setResendNote] = React.useState<string | null>(null);

  const handleSubmit = () => {
    const validation = validateInvite(name, email);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setStage("sending");
    window.setTimeout(() => {
      setStage("sent");
    }, 1200);
  };

  const handleResend = () => {
    setIsResending(true);
    window.setTimeout(() => {
      setIsResending(false);
      setResendNote(
        `Invite sent again to ${email.trim()}. It may take a minute to arrive.`,
      );
    }, 800);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setErrors({});
    setStage("form");
    setIsResending(false);
    setResendNote(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Add a parent
            </h1>
            <p className="text-sm text-muted-foreground">
              Keep {MOCK_STUDENT.name}&apos;s guardian in the loop on progress,
              attendance and fees.
            </p>
          </div>
        </div>

        <Card className="shadow-md">
          {stage !== "sent" ? (
            <React.Fragment>
              <CardHeader className="pb-0">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Enter their details and we will send an invite to{" "}
                  <span className="font-medium text-foreground">
                    {email.trim() || "their email"}
                  </span>
                  . Parents get their own view of classes, fees and results.
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="parent-name"
                      className={
                        errors.name ? "text-red-700 dark:text-red-300" : undefined
                      }
                    >
                      Parent&apos;s name
                    </Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="parent-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Rakesh Sharma"
                        className="pl-9"
                        disabled={stage === "sending"}
                      />
                    </div>
                    {errors.name ? (
                      <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="parent-email"
                      className={
                        errors.email ? "text-red-700 dark:text-red-300" : undefined
                      }
                    >
                      Parent&apos;s email
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="parent-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="parent@example.com"
                        className="pl-9"
                        disabled={stage === "sending"}
                      />
                    </div>
                    {errors.email ? (
                      <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={stage === "sending"}
                  >
                    <Send />
                    {stage === "sending" ? "Sending invite..." : "Send invite"}
                  </Button>

                  <Button
                    asChild
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                  >
                    <Link href="/student">Skip for now</Link>
                  </Button>
                </form>
              </CardContent>
            </React.Fragment>
          ) : (
            <CardContent className="pt-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Mail className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                Invite sent
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {name.trim()} ({email.trim()}) will receive an email with
                access instructions for {MOCK_STUDENT.name}&apos;s account.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <Button type="button" className="w-full" onClick={() => router.push("/student")}>
                  Continue
                  <ArrowRight />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isResending}
                  onClick={handleResend}
                >
                  {isResending ? "Resending..." : "Resend invite"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={resetForm}
                >
                  Add another parent
                </Button>
              </div>

              {resendNote ? (
                <p className="mt-3 text-xs text-muted-foreground" role="status">
                  {resendNote}
                </p>
              ) : null}

              <p className="mt-4 text-xs text-muted-foreground">
                Didn&apos;t see the email? Ask them to check the spam folder or
                use resend.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
