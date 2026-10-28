import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";

import { InviteAcceptCard } from "@/app/invite/[token]/invite-card";

export const metadata: Metadata = {
  title: "Accept invite | Vidyalaya",
};

export default function InvitePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </span>
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Vidyalaya
          </p>
        </div>
        <InviteAcceptCard />
      </div>
    </div>
  );
}
