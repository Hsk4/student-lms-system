"use client";

import * as React from "react";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RANGES = ["7 days", "30 days", "Term 1", "Full year"];

const STATS = [
  {
    label: "Total students",
    value: "2,486",
    delta: "+6.4%",
    icon: GraduationCap,
  },
  {
    label: "Teaching staff",
    value: "184",
    delta: "+2.1%",
    icon: UserCheck,
  },
  {
    label: "Fees collected",
    value: "₹1.84 Cr",
    delta: "+12.8%",
    icon: IndianRupee,
  },
  {
    label: "Library issues",
    value: "9,412",
    delta: "-1.7%",
    icon: BookOpen,
  },
];

const ENROLMENT = [
  { label: "Grade 6", value: 320 },
  { label: "Grade 7", value: 356 },
  { label: "Grade 8", value: 389 },
  { label: "Grade 9", value: 402 },
  { label: "Grade 10", value: 428 },
  { label: "Grade 11", value: 301 },
  { label: "Grade 12", value: 290 },
];

const BOARD_SHARE = [
  { label: "CBSE", value: 52 },
  { label: "ICSE", value: 24 },
  { label: "State Board", value: 14 },
  { label: "IB / Cambridge", value: 10 },
];

const ATTENDANCE = [
  { label: "Monday", value: 94 },
  { label: "Tuesday", value: 91 },
  { label: "Wednesday", value: 89 },
  { label: "Thursday", value: 93 },
  { label: "Friday", value: 87 },
];

export default function AnalyticsPage() {
  const [range, setRange] = React.useState(RANGES[1]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Snapshot of enrolment, revenue and attendance across the campus.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RANGES.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={range === item ? "default" : "outline"}
              onClick={() => setRange(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-start justify-between p-5">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold tabular-nums text-foreground">
                    {stat.value}
                  </p>
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    {stat.delta} vs last {range.toLowerCase()}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Enrolment by grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ENROLMENT.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {item.value}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(item.value / 450) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Board distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {BOARD_SHARE.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Users className="h-4 w-4" />
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Average attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 sm:gap-6">
            {ATTENDANCE.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-sm tabular-nums text-foreground">
                  {item.value}%
                </span>
                <div className="flex h-32 w-full items-end rounded-lg bg-secondary">
                  <div
                    className={cn(
                      "w-full rounded-lg bg-primary transition-all duration-500",
                      item.value < 90 && "bg-primary/70"
                    )}
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <ArrowUpRight className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              Need a deeper report?
            </p>
            <p className="text-xs text-muted-foreground">
              Export the full analytics dataset as a CSV (demo only).
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>
    </div>
  );
}
