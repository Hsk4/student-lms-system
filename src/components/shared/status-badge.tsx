import * as React from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";

const STATUS_VARIANTS: Record<string, NonNullable<BadgeProps["variant"]>> = {
  active: "success",
  approved: "success",
  paid: "success",
  published: "success",
  resolved: "success",
  closed: "secondary",
  completed: "success",
  pending: "warning",
  invited: "info",
  open: "info",
  in_progress: "info",
  processing: "info",
  partial: "warning",
  due: "warning",
  overdue: "destructive",
  rejected: "destructive",
  inactive: "secondary",
  failed: "destructive",
  cancelled: "destructive",
  draft: "secondary",
  archived: "secondary",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  className,
}: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status.toLowerCase()] ?? "secondary";
  const text =
    label ??
    status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");

  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  );
}
