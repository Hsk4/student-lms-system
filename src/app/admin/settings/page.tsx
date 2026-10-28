"use client";

import * as React from "react";
import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function ThemeSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="h-4 w-4 text-primary" />
          Theme
        </CardTitle>
        <CardDescription>
          Choose how the console looks. The change applies instantly across the
          whole app — background, text, cards and borders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          role="radiogroup"
          aria-label="Colour theme"
          className="grid gap-3 sm:grid-cols-3"
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = mounted && theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-accent text-accent-foreground shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.value === "light"
                    ? "Cream background with maroon accents"
                    : option.value === "dark"
                      ? "Warm dark background, maroon highlights"
                      : "Follow your device setting"}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsSection() {
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);
  const [pushAlerts, setPushAlerts] = React.useState(false);

  const rows = [
    {
      id: "email",
      title: "Email alerts",
      description: "Notify me when a new access request arrives.",
      value: emailAlerts,
      onChange: setEmailAlerts,
    },
    {
      id: "digest",
      title: "Weekly digest",
      description: "A Monday summary of fees, tickets and attendance.",
      value: weeklyDigest,
      onChange: setWeeklyDigest,
    },
    {
      id: "push",
      title: "Push notifications",
      description: "Instant alerts on critical audit log events.",
      value: pushAlerts,
      onChange: setPushAlerts,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notifications</CardTitle>
        <CardDescription>
          Demo switches — nothing is actually delivered anywhere.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {rows.map((row, index) => (
          <div key={row.id}>
            {index > 0 ? <Separator className="my-3" /> : null}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <p className="text-xs text-muted-foreground">
                  {row.description}
                </p>
              </div>
              <Switch
                checked={row.value}
                onCheckedChange={row.onChange}
                aria-label={row.title}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Personalise the console. Everything here is local demo state.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ThemeSection />
        <NotificationsSection />
      </div>
    </div>
  );
}
