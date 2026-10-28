"use client";

import * as React from "react";

import { ParentSidebar } from "@/components/layout/parent-sidebar";

export function ParentCollapsibleSidebar({ className }: { className?: string }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <ParentSidebar
      collapsed={collapsed}
      onToggleCollapsed={() => setCollapsed((value) => !value)}
      className={className}
    />
  );
}
