"use client";

import * as React from "react";

import { MOCK_TEACHER } from "@/app/teacher/mock/data";

export interface CurrentTeacherContextValue {
  teacher: typeof MOCK_TEACHER;
  pendingRequestCount: number;
  ungradedCount: number;
  pendingMeetingCount: number;
}

const CurrentTeacherContext =
  React.createContext<CurrentTeacherContextValue | null>(null);

export function CurrentTeacherProvider({
  pendingRequestCount,
  ungradedCount,
  pendingMeetingCount,
  children,
}: {
  pendingRequestCount: number;
  ungradedCount: number;
  pendingMeetingCount: number;
  children: React.ReactNode;
}) {
  const value = React.useMemo<CurrentTeacherContextValue>(
    () => ({
      teacher: MOCK_TEACHER,
      pendingRequestCount,
      ungradedCount,
      pendingMeetingCount,
    }),
    [pendingRequestCount, ungradedCount, pendingMeetingCount],
  );

  return (
    <CurrentTeacherContext.Provider value={value}>
      {children}
    </CurrentTeacherContext.Provider>
  );
}

export function useCurrentTeacher(): CurrentTeacherContextValue {
  const context = React.useContext(CurrentTeacherContext);
  if (!context) {
    throw new Error(
      "useCurrentTeacher must be used within a CurrentTeacherProvider",
    );
  }
  return context;
}
