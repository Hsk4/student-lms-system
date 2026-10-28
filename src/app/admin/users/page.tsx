import { UsersTable } from "@/app/admin/users/users-table";

export const metadata = {
  title: "Users | Vidyalaya Admin",
};

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Users
        </h2>
        <p className="text-sm text-muted-foreground">
          Students, teachers and parents registered with the school.
        </p>
      </div>

      <UsersTable />
    </div>
  );
}
