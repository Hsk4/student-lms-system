import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  Home,
  LifeBuoy,
  Receipt,
  User as UserIcon,
  Users,
} from "lucide-react";

export interface ParentNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  enabled: boolean;
}

export const PARENT_NAV_ITEMS: ParentNavItem[] = [
  {
    href: "/parent",
    label: "Home",
    icon: Home,
    description: "How your children are doing today",
    enabled: true,
  },
  {
    href: "/parent/children",
    label: "Children",
    icon: Users,
    description: "Linked children and their teachers",
    enabled: true,
  },
  {
    href: "/parent/fees",
    label: "Fees",
    icon: Receipt,
    description: "Invoices, due dates and payments",
    enabled: true,
  },
  {
    href: "/parent/meetings",
    label: "Meetings",
    icon: CalendarClock,
    description: "Request and review teacher meetings",
    enabled: true,
  },
  {
    href: "/parent/support",
    label: "Support",
    icon: LifeBuoy,
    description: "School contact details and office hours",
    enabled: true,
  },
  {
    href: "/parent/profile",
    label: "Profile",
    icon: UserIcon,
    description: "Your account and notification settings",
    enabled: true,
  },
];

export function getParentNavItems(): ParentNavItem[] {
  return PARENT_NAV_ITEMS.filter((item) => item.enabled);
}

export function findParentNavItem(pathname: string): ParentNavItem | undefined {
  const items = getParentNavItems();
  return items.find((item) => isParentNavItemActive(pathname, item.href));
}

export function isParentNavItemActive(pathname: string, href: string): boolean {
  return href === "/parent" ? pathname === "/parent" : pathname.startsWith(href);
}
