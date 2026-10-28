"use client";

import * as React from "react";
import { Lock, Mail, Save, ShieldCheck } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { ThemeSection } from "@/components/shared/theme-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentTeacher } from "@/hooks/use-current-teacher";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import {
  AVAILABILITY_DAYS,
  AVAILABILITY_HOURS,
  getAvailabilityMatrix,
  getClassesForTeacher,
} from "@/app/teacher/mock/data";
import { NewTicketDialog } from "@/app/teacher/support/new-ticket-dialog";
import { cn } from "@/lib/utils";

interface PreferenceRow {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const DEFAULT_PREFERENCES: PreferenceRow[] = [
  { id: "requests", title: "New enrollment requests", description: "When a student requests you.", enabled: true },
  { id: "submissions", title: "New submissions", description: "When a student submits an assignment.", enabled: true },
  { id: "meetings", title: "Meeting requests", description: "When a parent requests a meeting.", enabled: true },
  { id: "support", title: "Support replies", description: "When the school team replies to your ticket.", enabled: false },
];

export function ProfileView() {
  const load = useMockPageLoad();

  if (load.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-72 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    );
  }

  if (load.isError) {
    return (
      <ErrorState onRetry={load.retry} description="We could not load your profile. Please try again." />
    );
  }

  return <ProfileContent />;
}

function ProfileContent() {
  const { teacher } = useCurrentTeacher();
  const classes = React.useMemo(() => getClassesForTeacher(), []);

  const [bio, setBio] = React.useState(teacher.bio);
  const [phone, setPhone] = React.useState(teacher.phone);
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [availability, setAvailability] = React.useState<boolean[][]>(getAvailabilityMatrix);
  const [prefs, setPrefs] = React.useState<PreferenceRow[]>(DEFAULT_PREFERENCES);
  const [saving, setSaving] = React.useState(false);
  const [savedNote, setSavedNote] = React.useState(false);
  const [changeDialogOpen, setChangeDialogOpen] = React.useState(false);

  const initials = teacher.name.split(" ").map((part) => part[0]).slice(0, 2).join("");

  const toggleSlot = (dayIndex: number, hourIndex: number) => {
    setAvailability((current) =>
      current.map((row, index) =>
        index === dayIndex ? row.map((value, cellIndex) => (cellIndex === hourIndex ? !value : value)) : row,
      ),
    );
  };

  const handleSave = () => {
    const cleaned = phone.trim();
    if (cleaned && !/^[+0-9][0-9 ()-]{6,}$/.test(cleaned)) {
      setPhoneError("Use digits, spaces or + ( ) - only.");
      return;
    }
    setPhoneError(null);
    setSaving(true);
    // handleSaveTeacherProfile — replace with a real API call later.
    window.setTimeout(() => {
      setSaving(false);
      setSavedNote(true);
      window.setTimeout(() => setSavedNote(false), 2000);
    }, 700);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-2">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Your identity, weekly availability and notification settings.
        </p>
      </div>

      {savedNote ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">
          Profile saved (demo only — nothing is stored).
        </div>
      ) : null}

      {/* Identity card */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Identity
          </h3>
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-base font-semibold text-accent-foreground">
              {initials}
            </span>
            <div>
              <p className="text-base font-semibold text-foreground">{teacher.name}</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {teacher.email}
              </p>
              <Badge variant="accent" className="mt-1.5">{teacher.role}</Badge>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm sm:w-72">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Taught courses (managed by admin)
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {classes.slice(0, 3).map((cls) => (
                <li key={cls.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-foreground">{cls.name}</span>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="mt-2 h-auto p-0 text-primary"
              onClick={() => setChangeDialogOpen(true)}
            >
              Request change
            </Button>
          </div>
        </div>
      </section>

      {/* Editable: bio + phone */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">About you</h3>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="teacher-bio">Bio</Label>
            <Textarea
              id="teacher-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teacher-phone">Phone</Label>
            <Input
              id="teacher-phone"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setPhoneError(null);
              }}
              inputMode="tel"
              aria-invalid={phoneError ? true : undefined}
            />
            {phoneError ? (
              <p className="text-xs font-medium text-destructive" role="alert">{phoneError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Used by the school office.</p>
            )}
          </div>
        </div>
      </section>

      {/* Weekly availability grid */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Weekly availability</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap cells to toggle hours you are available. These slots appear shaded on your schedule.
          </p>
        </div>
        <div className="overflow-x-auto p-5">
          <table className="border-separate border-spacing-1">
            <thead>
              <tr>
                <th />
                {AVAILABILITY_HOURS.map((hour) => (
                  <th key={hour} className="px-1 pb-1 text-[10px] font-medium text-muted-foreground">
                    {hour > 12 ? `${hour - 12}p` : hour === 12 ? "12p" : `${hour}a`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AVAILABILITY_DAYS.map((day, dayIndex) => (
                <tr key={day}>
                  <th className="pr-2 text-right text-[11px] font-medium text-muted-foreground">{day}</th>
                  {AVAILABILITY_HOURS.map((hour, hourIndex) => {
                    const active = availability[dayIndex]?.[hourIndex] ?? false;
                    return (
                      <td key={`${day}-${hour}`}>
                        <button
                          type="button"
                          onClick={() => toggleSlot(dayIndex, hourIndex)}
                          aria-label={`${day} ${hour}:00 ${active ? "available" : "unavailable"}`}
                          aria-pressed={active}
                          className={cn(
                            "h-6 w-6 rounded transition-colors sm:h-7 sm:w-7",
                            active
                              ? "bg-primary hover:bg-primary-hover"
                              : "bg-secondary hover:bg-accent",
                          )}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notification preferences */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Notification preferences</h3>
          <p className="text-xs text-muted-foreground">Email channel</p>
        </div>
        <ul className="divide-y divide-border/70">
          {prefs.map((preference) => (
            <li key={preference.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{preference.title}</p>
                <p className="text-xs text-muted-foreground">{preference.description}</p>
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
        description="Choose how the teacher panel looks. Applies instantly across all dashboards."
      />

      {/* Sticky save bar */}
      <div className="sticky bottom-20 z-20 lg:bottom-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/85">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Email and courses are managed by the school office.
          </p>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
            ) : (
              <Save />
            )}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <NewTicketDialog
        open={changeDialogOpen}
        onOpenChange={setChangeDialogOpen}
        prefillSubject="Request change to my taught courses"
      />
    </div>
  );
}
