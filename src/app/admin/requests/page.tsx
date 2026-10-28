import { RequestsTable } from "@/app/admin/requests/requests-table";

export const metadata = {
  title: "Access requests | Vidyalaya Admin",
};

export default function RequestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Access requests
        </h2>
        <p className="text-sm text-muted-foreground">
          Review and approve role requests coming from students, teachers and
          parents.
        </p>
      </div>

      <RequestsTable />
    </div>
  );
}
