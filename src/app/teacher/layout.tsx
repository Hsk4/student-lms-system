import type { ReactNode } from "react";

import {
  getMeetingRequests,
  getPendingEnrollmentRequests,
  getUngradedSubmissions,
} from "@/app/teacher/mock/data";
import { TeacherBottomTabs } from "@/components/layout/teacher-bottom-tabs";
import { TeacherMobileDrawer } from "@/components/layout/teacher-mobile-drawer";
import { TeacherSidebar } from "@/components/layout/teacher-sidebar";
import { TeacherTopbar } from "@/components/layout/teacher-topbar";
import { CurrentTeacherProvider } from "@/hooks/use-current-teacher";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const pendingRequests = getPendingEnrollmentRequests().length;
  const ungraded = getUngradedSubmissions().length;
  const pendingMeetings = getMeetingRequests().filter(
    (request) => request.status === "pending",
  ).length;

  return (
    <CurrentTeacherProvider
      pendingRequestCount={pendingRequests}
      ungradedCount={ungraded}
      pendingMeetingCount={pendingMeetings}
    >
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <TeacherSidebar className="h-full" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="hidden lg:block">
            <TeacherTopbar />
          </div>
          <TeacherMobileDrawer />
          <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-10 lg:pt-6">
            <div className="mx-auto w-full max-w-[1280px]">{children}</div>
          </main>
        </div>

        <TeacherBottomTabs />
      </div>
    </CurrentTeacherProvider>
  );
}
