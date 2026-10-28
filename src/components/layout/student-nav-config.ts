import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileQuestion,
  Home,
  Library,
  ListChecks,
  LifeBuoy,
  Receipt,
  Users,
} from "lucide-react";

export interface StudentNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  enabled: boolean;
}

export const ENABLE_QUIZZES_FEATURE = false;

export const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  {
    href: "/student",
    label: "Home",
    icon: Home,
    description: "Your daily overview",
    enabled: true,
  },
  {
    href: "/student/teachers",
    label: "Teachers",
    icon: Users,
    description: "Find and request teachers",
    enabled: true,
  },
  {
    href: "/student/courses",
    label: "My courses",
    icon: BookOpen,
    description: "Enrolled courses and material",
    enabled: true,
  },
  {
    href: "/student/assignments",
    label: "Assignments",
    icon: ListChecks,
    description: "Homework and submissions",
    enabled: true,
  },
  {
    href: "/student/invoices",
    label: "Invoices",
    icon: Receipt,
    description: "Fees and invoices",
    enabled: true,
  },
  {
    href: "/student/books",
    label: "Books",
    icon: Library,
    description: "Recommended books",
    enabled: true,
  },
  {
    href: "/student/quizzes",
    label: "Quizzes",
    icon: FileQuestion,
    description: "Practice quizzes",
    enabled: ENABLE_QUIZZES_FEATURE,
  },
  {
    href: "/student/support",
    label: "Support",
    icon: LifeBuoy,
    description: "Help and support tickets",
    enabled: true,
  },
];

export function getStudentNavItems(): StudentNavItem[] {
  return STUDENT_NAV_ITEMS.filter((item) => item.enabled);
}

export function findStudentNavItem(
  pathname: string,
): StudentNavItem | undefined {
  const items = getStudentNavItems();
  return items.find((item) => isStudentNavItemActive(pathname, item.href));
}

export function isStudentNavItemActive(
  pathname: string,
  href: string,
): boolean {
  return href === "/student" ? pathname === "/student" : pathname.startsWith(href);
}
