import { BoardsTable } from "@/app/admin/boards/boards-table";

export const metadata = {
  title: "Boards | Vidyalaya Admin",
};

export default function BoardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Boards
        </h2>
        <p className="text-sm text-muted-foreground">
          Academic boards and curricula followed by the school.
        </p>
      </div>

      <BoardsTable />
    </div>
  );
}
