import { AuditLogTable } from "@/app/admin/audit-log/audit-log-table";

export const metadata = {
  title: "Audit log | Vidyalaya Admin",
};

export default function AuditLogPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Audit log
        </h2>
        <p className="text-sm text-muted-foreground">
          Trail of every privileged action performed in the console.
        </p>
      </div>

      <AuditLogTable />
    </div>
  );
}
