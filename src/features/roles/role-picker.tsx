"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADMIN_ROLES, ROLE_LABELS } from "@/features/roles/permissions";
import { cn } from "@/lib/utils";
import type { AdminRole, UserRole } from "@/types/user";

interface RolePickerProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  allowedRoles?: UserRole[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function RolePicker({
  value,
  onChange,
  allowedRoles,
  disabled,
  className,
  placeholder = "Select role",
}: RolePickerProps) {
  const options = React.useMemo(() => {
    const base: UserRole[] = ["student", "teacher", "parent"];
    const roles = allowedRoles
      ? allowedRoles.filter((role) => base.includes(role) || ADMIN_ROLES.includes(role as AdminRole))
      : base;
    return roles;
  }, [allowedRoles]);

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as UserRole)}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
