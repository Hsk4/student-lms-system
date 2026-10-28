import { InvoicesTable } from "@/app/student/invoices/invoices-table";
import { dateIn, formatDateOnly, formatRs } from "@/lib/format";

export const metadata = {
  title: "Invoices | Vidyalaya Student",
};

export default function StudentInvoicesPage() {
  const totalDueNow = 35500;
  const nextDueDate = dateIn(3, 17, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Invoices
        </h2>
        <p className="text-sm text-muted-foreground">
          Your fee invoices, due dates and paid history.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <div>
          <p className="text-xs text-muted-foreground">Total due now</p>
          <p className="text-lg font-semibold tracking-tight text-foreground">
            {formatRs(totalDueNow)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Next due</p>
          <p className="text-sm font-medium text-foreground">
            {formatDateOnly(nextDueDate)}
          </p>
        </div>
      </div>

      <InvoicesTable />
    </div>
  );
}
