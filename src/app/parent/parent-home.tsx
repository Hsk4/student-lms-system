"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Info,
  Monitor,
  Receipt,
  Users,
} from "lucide-react";

import { ChildSummarySection } from "@/app/parent/child-summary-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentParent } from "@/hooks/use-current-parent";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import {
  feeTotalsFor,
  getGradesForChild,
  getHomeAlertsForChild,
  getInvoicesForChild,
  getUpcomingEventsForChild,
} from "@/app/parent/mock/data";
import type {
  CalendarEventType,
  GradeItem,
  UpcomingEvent,
} from "@/app/parent/mock/types";
import { formatDateOnly, formatDateTime, formatRs } from "@/lib/format";

const UPCOMING_ICON: Record<CalendarEventType, React.ComponentType<{ className?: string }>> = {
  assignment: ClipboardList,
  session: Monitor,
  meeting: CalendarClock,
  invoice: Receipt,
};

export function ParentHomePage() {
  const {
    parent,
    scopedChildId,
    isAllChildrenSelected,
    linkedChildren,
  } = useCurrentParent();

  const controller = useMockPageLoad();

  const events = React.useMemo(
    () => getUpcomingEventsForChild(scopedChildId),
    [scopedChildId],
  );

  if (controller.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-72 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (controller.isError) {
    return (
      <ErrorPlaceholder
        title="Could not load dashboard"
        message="We could not load your children's data right now. Please try again."
        onRetry={controller.retry}
      />
    );
  }

  const scopedChildren = isAllChildrenSelected
    ? linkedChildren
    : linkedChildren.filter((child) => child.id === scopedChildId);

  const greetingName = parent.name.split(" ")[0];
  const hour = new Date().getHours();
  const dayPart = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Good {dayPart}, {greetingName}
        </h2>
        <p className="text-sm text-muted-foreground">
          {formatDateOnly(new Date())} · An at-a-glance view of how your children are doing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <ChildSummarySection childrenList={scopedChildren} className="order-2 lg:col-span-2 lg:col-start-1 lg:row-start-1" />

        <UpcomingSection events={events} className="order-3 lg:col-start-1 lg:row-start-2" />
        <AlertsSection className="order-1 lg:col-start-2 lg:row-start-2" />

        <RecentGradesSection className="order-4 lg:col-start-1 lg:row-start-3" />
        <FeeStatusSection className="order-5 lg:col-start-2 lg:row-start-3" />
      </div>
    </div>
  );
}

function ErrorPlaceholder({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="order-1 rounded-xl border border-red-200 bg-red-50/60 p-8 text-center dark:border-red-900/60 dark:bg-red-950/30">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function UpcomingSection({
  events,
  className,
}: {
  events: UpcomingEvent[];
  className?: string;
}) {
  const visible = events.slice(0, 6);

  return (
    <SectionCard
      title="Upcoming"
      description="Next 7 days"
      className={className}
      action={
        <Link
          href="/parent/meetings"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Meetings
          <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      {visible.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          Nothing scheduled in the next 7 days.
        </div>
      ) : (
        <ul className="divide-y divide-border/70">
          {visible.map((event) => {
            const Icon = UPCOMING_ICON[event.type];
            return (
              <li key={event.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(event.date)}
                  </p>
                </div>
                <ChildTagBadge childId={event.childId} />
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}

export function ChildTagBadge({ childId }: { childId: string }) {
  const { linkedChildren } = useCurrentParent();
  const child = linkedChildren.find((item) => item.id === childId);
  if (!child) return null;
  if (!child) return null;
  return (
    <Badge variant="accent" className="shrink-0 text-[10px]">
      {child.name.split(" ")[0]}
    </Badge>
  );
}

function AlertItem({
  severity,
  message,
  childId,
  href,
}: {
  severity: "critical" | "warning" | "info";
  message: string;
  childId: string;
  href: string;
}) {
  const tone =
    severity === "critical"
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      : severity === "warning"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";

  return (
    <li>
      <Link
        href={href}
        className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-secondary/50"
      >
        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <AlertTriangle className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-snug text-foreground">{message}</span>
        </span>
        <ChildTagBadge childId={childId} />
      </Link>
    </li>
  );
}

function AlertsSection({ className }: { className?: string }) {
  const { scopedChildId } = useCurrentParent();
  const alerts = React.useMemo(() => getHomeAlertsForChild(scopedChildId), [scopedChildId]);

  return (
    <SectionCard
      title="Alerts"
      description="Needs your attention"
      className={className}
      action={
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          {alerts.length}
        </span>
      }
    >
      {alerts.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-foreground">
            Nothing needs your attention.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            All grades, attendance and invoices look fine.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/70">
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              severity={alert.severity}
              message={alert.message}
              childId={alert.childId}
              href={alert.href}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function RecentGradesSection({ className }: { className?: string }) {
  const { scopedChildId, selectedChild, linkedChildren } = useCurrentParent();
  const targetChild =
    selectedChild ??
    linkedChildren.find((child) => child.status === "active") ??
    linkedChildren[0];

  const grades: GradeItem[] = React.useMemo(
    () => getGradesForChild(scopedChildId),
    [scopedChildId],
  );

  return (
    <SectionCard
      title="Recent grades"
      description="Latest graded work"
      className={className}
      action={
        targetChild ? (
          <Link
            href={`/parent/children/${targetChild.id}`}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : null
      }
    >
      {grades.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          No grades posted yet.
        </div>
      ) : (
        <ul className="divide-y divide-border/70">
          {grades
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 5)
            .map((grade) => (
              <li key={grade.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {grade.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {grade.subject} · {grade.childId === "stu-1024" ? "Aditi" : grade.childId === "stu-1025" ? "Aarav" : "Zoya"}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {grade.score}/{grade.max}
                </span>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                  {formatDateOnly(grade.date)}
                </span>
              </li>
            ))}
        </ul>
      )}
    </SectionCard>
  );
}

function FeeStatusSection({ className }: { className?: string }) {
  const { scopedChildId, isAllChildrenSelected, selectedChild, linkedChildren } = useCurrentParent();

  const invoices = React.useMemo(
    () => getInvoicesForChild(scopedChildId),
    [scopedChildId],
  );
  const totals = React.useMemo(() => feeTotalsFor(invoices), [invoices]);

  return (
    <SectionCard
      title="Fee status"
      className={className}
      description={
        isAllChildrenSelected
          ? `${linkedChildren.length} children`
          : selectedChild?.name
      }
      action={
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Users className="h-4 w-4" />
        </span>
      }
    >
      <div className="px-5 py-4">
        <p className="text-xs text-muted-foreground">Outstanding total</p>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {formatRs(totals.outstanding)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            Paid this term:{" "}
            <span className="font-medium text-foreground">
              {formatRs(totals.paidThisTerm)}
            </span>
          </span>
          {totals.nextDueDate ? (
            <span>
              Next due:{" "}
              <span className="font-medium text-foreground">
                {formatDateOnly(totals.nextDueDate)}
              </span>
            </span>
          ) : null}
        </div>
        <Button asChild type="button" className="mt-4 w-full">
          <Link href="/parent/fees">
            <Receipt />
            View invoices
          </Link>
        </Button>
      </div>
    </SectionCard>
  );
}
