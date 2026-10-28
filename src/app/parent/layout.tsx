import type { ReactNode } from "react";

import { ParentCollapsibleSidebar } from "@/components/layout/parent-collapsible-sidebar";
import { ParentBottomTabs } from "@/components/layout/parent-bottom-tabs";
import { ParentMobileTopbar } from "@/components/layout/parent-mobile-topbar";
import { ParentTopbar } from "@/components/layout/parent-topbar";
import { CurrentParentProvider } from "@/hooks/use-current-parent";

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <CurrentParentProvider>
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <ParentCollapsibleSidebar className="h-full" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="hidden lg:block">
            <ParentTopbar />
          </div>
          <div className="lg:hidden">
            <ParentMobileTopbar />
          </div>
          <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-10 lg:pt-6">
            <div className="mx-auto w-full max-w-[1100px]">{children}</div>
          </main>
        </div>

        <ParentBottomTabs />
      </div>
    </CurrentParentProvider>
  );
}
