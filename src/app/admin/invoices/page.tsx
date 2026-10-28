import { InvoicesTable } from "@/app/admin/invoices/invoices-table";

export const metadata = {
  title: "Invoices | Vidyalaya Admin",
};

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Invoices
        </h2>
        <p className="text-sm text-muted-foreground">
          Fee invoices, payments and outstanding balances.
        </p>
      </div>

      <InvoicesTable />
    </div>
  );
}
