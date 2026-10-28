"use client";

import * as React from "react";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  board: string;
  level: string;
}

export const MOCK_STUDENT: StudentProfile = {
  id: "stu-1024",
  name: "Aditi Sharma",
  email: "aditi.sharma@school.edu",
  board: "CBSE Board",
  level: "Grade 9",
};

export function useCurrentStudent(): StudentProfile {
  return React.useMemo(() => MOCK_STUDENT, []);
}
