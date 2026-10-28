"use client";

import * as React from "react";
import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

interface ThemeSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Shared Light / Dark / System theme picker used by every dashboard's
 * settings/profile page. Uses the single root next-themes provider so the
 * choice applies instantly across all four dashboards and persists.
 */
export function ThemeSection({
  title = "Theme",
  description = "Choose how the app looks. The change applies instantly across the whole app — background, text, cards and borders.",
  className,
}: ThemeSectionProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
      aria-label="Theme settings"
    >
      <div className="border-b border-border px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Palette className="h-4 w-4 text-primary" />
          {title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="p-5">
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
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
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
      </div>
    </section>
  );
}
