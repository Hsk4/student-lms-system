"use client";

import * as React from "react";
import { Link2, Lock, Save, ShieldCheck } from "lucide-react";

import { mockParentProfileData } from "@/app/parent/profile/profile-data";
import { ErrorState } from "@/components/shared/error-state";
import { ThemeSection } from "@/components/shared/theme-section";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateOnly } from "@/lib/format";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";

export function ProfileView() {
  const controller = useMockPageLoad();

  if (controller.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-72 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    );
  }

  if (controller.isError) {
    return (
      <ErrorState
        onRetry={controller.retry}
        description="We could not load your profile. Please try again."
      />
    );
  }

  return <ProfileContent />;
}

function ProfileContent() {
  const profile = mockParentProfileData.profiles;
  const linked = mockParentProfileData.children;

  const [phone, setPhone] = React.useState(profile.phone);
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [prefs, setPrefs] = React.useState(mockParentProfileData.preferences);
  const [saving, setSaving] = React.useState(false);
  const [savedNote, setSavedNote] = React.useState<string | null>(null);

  const handleSave = () => {
    const cleaned = phone.trim();
    if (cleaned && !/^[+0-9][0-9 ()-]{6,}$/.test(cleaned)) {
      setPhoneError("Use digits, spaces or + ( ) - only.");
      return;
    }
    setPhoneError(null);
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSavedNote("Preferences saved.");
    }, 700);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-10">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Profile
        </h2>
        <p className="text-sm text-muted-foreground">
          Your account and how you hear from the school.
        </p>
      </div>

      {savedNote ? (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          role="status"
        >
          {savedNote}
        </div>
      ) : null}

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Account
          </h3>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Name</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-name"
                value={profile.name}
                readOnly
                disabled
                className="cursor-not-allowed bg-secondary/60 pl-9 text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Contact the school office to change your name.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-email"
                value={profile.email}
                readOnly
                disabled
                className="cursor-not-allowed bg-secondary/60 pl-9 text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">Read-only.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-phone">Phone</Label>
            <Input
              id="profile-phone"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setPhoneError(null);
              }}
              placeholder="+92 300 1234567"
              inputMode="tel"
              aria-invalid={phoneError !== null}
            />
            {phoneError ? (
              <p className="text-xs font-medium text-destructive" role="alert">
                {phoneError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Used for urgent alerts.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            Linked children
          </h3>
        </div>
        <ul className="divide-y divide-border/70">
          {linked.map((child) => (
            <li key={child.childId} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {child.childName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {child.relationship} · Linked {formatDateOnly(child.linkDate)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="border-t border-border/70 px-5 py-3 text-xs text-muted-foreground">
          To unlink a child or change a relationship, contact admin.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">
            Notification preferences
          </h3>
          <p className="text-xs text-muted-foreground">Email channel</p>
        </div>
        <ul className="divide-y divide-border/70">
          {prefs.map((preference) => (
            <li
              key={preference.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {preference.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {preference.description}
                </p>
              </div>
              <Switch
                checked={preference.enabled}
                onCheckedChange={(checked) =>
                  setPrefs((current) =>
                    current.map((item) =>
                      item.id === preference.id ? { ...item, enabled: checked } : item,
                    ),
                  )
                }
                aria-label={`Toggle ${preference.title}`}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Theme */}
      <ThemeSection
        description="Choose how the parent panel looks. Applies instantly across all dashboards."
      />

      <div className="sticky bottom-20 z-20 lg:bottom-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <p className="text-xs text-muted-foreground">
            Changes apply to email notifications only.
          </p>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
            ) : (
              <Save />
            )}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
