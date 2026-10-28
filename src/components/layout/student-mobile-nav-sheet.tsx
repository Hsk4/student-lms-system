"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { StudentSidebar } from "@/components/layout/student-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function StudentMobileNavSheet() {
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
          <SheetDescription>Student panel navigation</SheetDescription>
        </SheetHeader>
        <StudentSidebar
          onNavigate={() => setOpen(false)}
          className="border-r-0"
        />
      </SheetContent>
    </Sheet>
  );
}
