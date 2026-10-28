"use client";

import * as React from "react";

import type { AdminRole, CurrentUser } from "@/types/user";

interface CurrentUserContextValue {
  user: CurrentUser;
  role: AdminRole;
  setRole: (role: AdminRole) => void;
  isSuperAdmin: boolean;
}

const CurrentUserContext = React.createContext<CurrentUserContextValue | null>(
  null
);

const MOCK_USERS: Record<AdminRole, CurrentUser> = {
  admin: {
    id: "adm-001",
    name: "Aarav Sharma",
    email: "aarav.sharma@school.edu",
    role: "admin",
  },
  super_admin: {
    id: "adm-000",
    name: "Meera Kapoor",
    email: "meera.kapoor@school.edu",
    role: "super_admin",
  },
};

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<AdminRole>("super_admin");

  const value = React.useMemo<CurrentUserContextValue>(
    () => ({
      user: MOCK_USERS[role],
      role,
      setRole,
      isSuperAdmin: role === "super_admin",
    }),
    [role]
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = React.useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      "useCurrentUser must be used within a CurrentUserProvider"
    );
  }
  return context;
}
