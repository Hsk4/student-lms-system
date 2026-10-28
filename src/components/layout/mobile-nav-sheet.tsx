"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function MobileNavSheet() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 sm:max-w-[300px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Admin panel navigation</SheetDescription>
        </SheetHeader>
        <AdminSidebar
          onNavigate={() => setOpen(false)}
          className="border-r-0"
        />
      </SheetContent>
    </Sheet>
  );
}
