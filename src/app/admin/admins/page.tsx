import { AdminsTable } from "@/app/admin/admins/admins-table";

export const metadata = {
  title: "Admins | Vidyalaya Admin",
};

export default function AdminsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Admins
        </h2>
        <p className="text-sm text-muted-foreground">
          Administrator accounts and the permissions they hold.
        </p>
      </div>

      <AdminsTable />
    </div>
  );
}
