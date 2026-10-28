import type { ReactNode } from "react";

import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { CurrentUserProvider } from "@/hooks/use-current-user";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <CurrentUserProvider>
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <AdminSidebar className="h-full" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </CurrentUserProvider>
  );
}
