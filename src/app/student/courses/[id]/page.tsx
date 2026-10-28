import { CourseTabs } from "@/app/student/courses/[id]/course-tabs";

export const metadata = {
  title: "Course | Vidyalaya Student",
};

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CourseTabs courseId={params.id} />;
}
