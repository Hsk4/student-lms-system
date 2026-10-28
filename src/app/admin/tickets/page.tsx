import { TicketsTable } from "@/app/admin/tickets/tickets-table";

export const metadata = {
  title: "Tickets | Vidyalaya Admin",
};

export default function TicketsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Tickets
        </h2>
        <p className="text-sm text-muted-foreground">
          Support tickets raised by students, teachers and parents.
        </p>
      </div>

      <TicketsTable />
    </div>
  );
}
