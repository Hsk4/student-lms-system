import { CoursesList } from "@/app/student/courses/courses-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata = {
  title: "My courses | Vidyalaya Student",
};

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            My courses
          </h2>
          <p className="text-sm text-muted-foreground">
            Every course you have requested or are enrolled in.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/student/teachers">
              <UserPlus />
              Find a teacher
            </Link>
          </Button>
        </div>
      </div>

      <CoursesList />
    </div>
  );
}
