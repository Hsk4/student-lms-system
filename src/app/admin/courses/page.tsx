import { CoursesTable } from "@/app/admin/courses/courses-table";

export const metadata = {
  title: "Courses | Vidyalaya Admin",
};

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Courses
        </h2>
        <p className="text-sm text-muted-foreground">
          Courses offered across boards, grades and faculties.
        </p>
      </div>

      <CoursesTable />
    </div>
  );
}
