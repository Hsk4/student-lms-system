"use client";

import * as React from "react";

import { OverviewTab } from "@/app/teacher/students/[id]/overview-tab";
import { StudentAssignmentsTab } from "@/app/teacher/students/[id]/assignments-tab";
import { StudentAttendanceTab } from "@/app/teacher/students/[id]/attendance-tab";
import { NotesTab } from "@/app/teacher/students/[id]/notes-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "assignments", label: "Assignments" },
  { value: "attendance", label: "Attendance" },
  { value: "notes", label: "Notes" },
] as const;

export function StudentTabs({ studentId }: { studentId: string }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4 w-full justify-start overflow-x-auto sm:w-auto">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="shrink-0">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab studentId={studentId} />
      </TabsContent>
      <TabsContent value="assignments">
        <StudentAssignmentsTab studentId={studentId} />
      </TabsContent>
      <TabsContent value="attendance">
        <StudentAttendanceTab studentId={studentId} />
      </TabsContent>
      <TabsContent value="notes">
        <NotesTab studentId={studentId} />
      </TabsContent>
    </Tabs>
  );
}
