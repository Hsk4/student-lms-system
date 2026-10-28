import type { ReactNode } from "react";

import { AiAssistantFab } from "@/components/shared/ai-assistant/ai-assistant-fab";
import { StudentHeader } from "@/components/layout/student-header";
import { StudentSidebar } from "@/components/layout/student-sidebar";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <StudentSidebar className="h-full" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <StudentHeader />
        <main className="flex-1 px-4 pb-28 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1100px]">{children}</div>
        </main>
      </div>

      <AiAssistantFab />
    </div>
  );
}
