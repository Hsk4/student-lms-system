"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AssignmentForm } from "@/app/teacher/assignments/assignment-form";

export default function NewAssignmentPage() {
  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/teacher/assignments"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Assignments
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium text-foreground">New assignment</span>
      </nav>

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">New assignment</h2>
        <p className="text-sm text-muted-foreground">
          Write the instructions, pick a target and publish when ready.
        </p>
      </div>

      <AssignmentForm />
    </div>
  );
}
