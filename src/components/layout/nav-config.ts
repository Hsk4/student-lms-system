import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  Inbox,
  Receipt,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/requests",
    label: "Requests",
    icon: Inbox,
    description: "Role access requests",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    description: "Students, teachers and parents",
  },
  {
    href: "/admin/boards",
    label: "Boards",
    icon: ClipboardList,
    description: "Academic boards",
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: FileText,
    description: "Courses and curricula",
  },
  {
    href: "/admin/books",
    label: "Books",
    icon: BookOpen,
    description: "Library inventory",
  },
  {
    href: "/admin/invoices",
    label: "Invoices",
    icon: Receipt,
    description: "Fees and invoices",
  },
  {
    href: "/admin/tickets",
    label: "Tickets",
    icon: Ticket,
    description: "Support tickets",
  },
  {
    href: "/admin/audit-log",
    label: "Audit log",
    icon: ShieldCheck,
    description: "Activity trail",
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "School performance",
  },
];

export const SUPER_ADMIN_NAV_ITEM: NavItem = {
  href: "/admin/admins",
  label: "Admins",
  icon: ShieldCheck,
  superAdminOnly: true,
  description: "Administrator accounts",
};

export const SETTINGS_NAV_ITEM: NavItem = {
  href: "/admin/settings",
  label: "Settings",
  icon: Settings,
  description: "Theme and console preferences",
};

export function getNavItems(isSuperAdmin: boolean): NavItem[] {
  return isSuperAdmin
    ? [...NAV_ITEMS, SUPER_ADMIN_NAV_ITEM]
    : NAV_ITEMS;
}

export function findNavItem(
  pathname: string,
  isSuperAdmin: boolean
): NavItem | undefined {
  if (pathname.startsWith(SETTINGS_NAV_ITEM.href)) return SETTINGS_NAV_ITEM;
  return getNavItems(isSuperAdmin).find((item) =>
    pathname.startsWith(item.href)
  );
}
