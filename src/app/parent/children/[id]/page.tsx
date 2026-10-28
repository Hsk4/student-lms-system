export const metadata = {
  title: "Child | Vidyalaya Parent",
};

import { ChildDetailPage } from "@/app/parent/children/[id]/child-detail";

export default function ChildDetailRoute({
  params,
}: {
  params: { id: string };
}) {
  return <ChildDetailPage childId={params.id} />;
}
