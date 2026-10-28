import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FolderOpen,
  Home,
  Inbox,
  LifeBuoy,
  TableProperties,
  User,
  Users,
  UserSquare2,
} from "lucide-react";

export interface TeacherNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  /** Optional live badge key rendered by the shell. */
  badgeKey?: "requests" | "grading" | "meetings";
}

export const TEACHER_NAV_ITEMS: TeacherNavItem[] = [
  {
    href: "/teacher",
    label: "Dashboard",
    icon: Home,
    description: "Today's plan and quick actions",
  },
  {
    href: "/teacher/students",
    label: "My Students",
    icon: UserSquare2,
    description: "Students you teach, roster and parents",
  },
  {
    href: "/teacher/classes",
    label: "Classes",
    icon: Users,
    description: "Group classes and upcoming sessions",
  },
  {
    href: "/teacher/requests",
    label: "Enrollment Requests",
    icon: Inbox,
    description: "Accept or decline student requests",
    badgeKey: "requests",
  },
  {
    href: "/teacher/assignments",
    label: "Assignments",
    icon: ClipboardList,
    description: "Create, publish and close assignments",
  },
  {
    href: "/teacher/grading",
    label: "Grading",
    icon: ClipboardCheck,
    description: "Submissions waiting to be graded",
    badgeKey: "grading",
  },
  {
    href: "/teacher/gradebook",
    label: "Gradebook",
    icon: TableProperties,
    description: "Grades grid per class and term",
  },
  {
    href: "/teacher/attendance",
    label: "Attendance",
    icon: CalendarDays,
    description: "Take attendance and view history",
  },
  {
    href: "/teacher/schedule",
    label: "Schedule",
    icon: Users,
    description: "Sessions and parent meetings",
    badgeKey: "meetings",
  },
  {
    href: "/teacher/materials",
    label: "Materials",
    icon: FolderOpen,
    description: "Worksheets, notes and recordings",
  },
  {
    href: "/teacher/support",
    label: "Support",
    icon: LifeBuoy,
    description: "Raise and track school requests",
  },
  {
    href: "/teacher/profile",
    label: "Profile",
    icon: User,
    description: "Bio, availability and notifications",
  },
];

export function getTeacherNavItems(): TeacherNavItem[] {
  return TEACHER_NAV_ITEMS;
}

export function findTeacherNavItem(pathname: string): TeacherNavItem | undefined {
  const items = getTeacherNavItems();
  return items.find((item) => isTeacherNavItemActive(pathname, item.href));
}

export function isTeacherNavItemActive(pathname: string, href: string): boolean {
  return href === "/teacher" ? pathname === "/teacher" : pathname.startsWith(href);
}
