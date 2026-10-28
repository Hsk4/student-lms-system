"use client";

import * as React from "react";

import { AssignmentsTab } from "@/app/parent/children/[id]/assignments-tab";
import { AttendanceTab } from "@/app/parent/children/[id]/attendance-tab";
import { GradesTab } from "@/app/parent/children/[id]/grades-tab";
import { OverviewTab } from "@/app/parent/children/[id]/overview-tab";
import { TeachersTab } from "@/app/parent/children/[id]/teachers-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChildTabValue = "overview" | "grades" | "attendance" | "assignments" | "teachers";

const TAB_ITEMS: { value: ChildTabValue; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "grades", label: "Grades" },
  { value: "attendance", label: "Attendance" },
  { value: "assignments", label: "Assignments" },
  { value: "teachers", label: "Teachers" },
];

interface ChildTabsProps {
  childId: string;
  onRequestMeeting: () => void;
}

export function ChildTabs({ childId, onRequestMeeting }: ChildTabsProps) {
  return (
    <Tabs defaultValue="overview" className="flex min-w-0 flex-col gap-4">
      <TabsList
        className="max-w-full overflow-x-auto justify-start pr-1"
        aria-label="Child detail tabs"
      >
        {TAB_ITEMS.map((item) => (
          <TabsTrigger key={item.value} value={item.value} className="shrink-0">
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab childId={childId} />
      </TabsContent>
      <TabsContent value="grades">
        <GradesTab childId={childId} />
      </TabsContent>
      <TabsContent value="attendance">
        <AttendanceTab childId={childId} />
      </TabsContent>
      <TabsContent value="assignments">
        <AssignmentsTab childId={childId} />
      </TabsContent>
      <TabsContent value="teachers">
        <TeachersTab childId={childId} onRequestMeeting={onRequestMeeting} />
      </TabsContent>
    </Tabs>
  );
}
