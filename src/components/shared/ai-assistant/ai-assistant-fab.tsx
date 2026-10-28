"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function AiAssistantFab() {
  const pathname = usePathname();

  if (pathname.startsWith("/student/assistant")) return null;

  return (
    <Link
      href="/student/assistant"
      aria-label="Open AI Assistant"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg transition-all duration-200",
        "hover:scale-105 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <Sparkles className="h-5 w-5" />
    </Link>
  );
}
