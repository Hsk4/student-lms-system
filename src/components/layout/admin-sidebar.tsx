"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { getNavItems } from "@/components/layout/nav-config";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isSuperAdmin } = useCurrentUser();
  const items = getNavItems(isSuperAdmin);

  const mainItems = items.filter((item) => !item.superAdminOnly);
  const superAdminItems = items.filter((item) => item.superAdminOnly);

  const renderItem = (item: (typeof items)[number]) => {
    const isActive = pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive
                ? "text-accent-foreground"
                : "text-muted-foreground group-hover:text-primary"
            )}
          />
          <span className="truncate">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-6 border-r border-border bg-secondary/60 px-4 py-5",
        className
      )}
    >
      <Link href="/admin/requests" className="flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">
            Vidyalaya
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            Admin Console
          </span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">{mainItems.map(renderItem)}</ul>

        {superAdminItems.length > 0 ? (
          <>
            <Separator className="my-4" />
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Super admin
            </p>
            <ul className="flex flex-col gap-1">
              {superAdminItems.map(renderItem)}
            </ul>
          </>
        ) : null}
      </nav>

      <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground shadow-sm">
        <p className="font-medium text-foreground">Demo mode</p>
        <p className="mt-1 leading-relaxed">
          All data is mocked locally. No backend or authentication is wired up.
        </p>
      </div>
    </div>
  );
}
