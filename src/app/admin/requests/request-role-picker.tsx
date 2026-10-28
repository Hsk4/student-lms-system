"use client";

import * as React from "react";

import { RolePicker } from "@/features/roles/role-picker";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { UserRole } from "@/types/user";

interface RequestRolePickerProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
  className?: string;
}

export function RequestRolePicker({
  value,
  onChange,
  disabled,
  className,
}: RequestRolePickerProps) {
  const { isSuperAdmin } = useCurrentUser();

  const allowedRoles = React.useMemo<UserRole[]>(
    () =>
      isSuperAdmin
        ? ["student", "teacher", "parent", "admin", "super_admin"]
        : ["student", "teacher", "parent"],
    [isSuperAdmin]
  );

  return (
    <RolePicker
      value={value}
      onChange={onChange}
      allowedRoles={allowedRoles}
      disabled={disabled}
      className={className}
    />
  );
}
