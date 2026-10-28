import type { AdminRole, UserRole } from "@/types/user";

export const ALL_ROLES: UserRole[] = [
  "student",
  "teacher",
  "parent",
  "admin",
  "super_admin",
];

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  teacher: "Teacher",
  parent: "Parent",
  admin: "Admin",
  super_admin: "Super Admin",
};

export const ADMIN_ROLES: AdminRole[] = ["admin", "super_admin"];

export interface RolePermissions {
  manageRequests: boolean;
  manageUsers: boolean;
  manageAcademics: boolean;
  manageFinance: boolean;
  manageSupport: boolean;
  viewAuditLog: boolean;
  viewAnalytics: boolean;
  manageAdmins: boolean;
}

export const ROLE_PERMISSIONS: Record<AdminRole, RolePermissions> = {
  admin: {
    manageRequests: true,
    manageUsers: true,
    manageAcademics: true,
    manageFinance: false,
    manageSupport: true,
    viewAuditLog: true,
    viewAnalytics: true,
    manageAdmins: false,
  },
  super_admin: {
    manageRequests: true,
    manageUsers: true,
    manageAcademics: true,
    manageFinance: true,
    manageSupport: true,
    viewAuditLog: true,
    viewAnalytics: true,
    manageAdmins: true,
  },
};

export function getPermissions(role: AdminRole): RolePermissions {
  return ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.admin;
}

export function canViewRole(
  role: AdminRole,
  target: UserRole
): boolean {
  if (ADMIN_ROLES.includes(target as AdminRole)) {
    return role === "super_admin";
  }
  return true;
}
