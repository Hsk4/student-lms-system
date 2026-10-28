export type UserRole = "student" | "teacher" | "parent" | "admin" | "super_admin";

export type AdminRole = Extract<UserRole, "admin" | "super_admin">;

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
}

export type UserStatus = "active" | "inactive" | "pending";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Exclude<UserRole, "admin" | "super_admin">;
  status: UserStatus;
  className: string;
  joinedAt: string;
  phone: string;
}
