import { BooksTable } from "@/app/admin/books/books-table";

export const metadata = {
  title: "Books | Vidyalaya Admin",
};

export default function BooksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Books
        </h2>
        <p className="text-sm text-muted-foreground">
          Library inventory, copies and availability.
        </p>
      </div>

      <BooksTable />
    </div>
  );
}
