"use client";

import * as React from "react";

import { RosterTab } from "@/app/teacher/classes/[id]/roster-tab";
import { ClassAssignmentsTab } from "@/app/teacher/classes/[id]/class-assignments-tab";
import { ClassAttendanceTab } from "@/app/teacher/classes/[id]/class-attendance-tab";
import { ClassMaterialsTab } from "@/app/teacher/classes/[id]/class-materials-tab";
import { ClassSettingsTab } from "@/app/teacher/classes/[id]/class-settings-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeacherClass } from "@/app/teacher/mock/types";

const TABS = [
  { value: "roster", label: "Roster" },
  { value: "assignments", label: "Assignments" },
  { value: "attendance", label: "Attendance" },
  { value: "materials", label: "Materials" },
  { value: "settings", label: "Settings" },
] as const;

export function ClassTabs({
  cls,
  tab,
  onTabChange,
}: {
  cls: TeacherClass;
  tab?: string;
  onTabChange?: (tab: string) => void;
}) {
  return (
    <Tabs value={tab} defaultValue="roster" onValueChange={onTabChange}>
      <TabsList className="mb-4 w-full justify-start overflow-x-auto sm:w-auto">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="shrink-0">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="roster">
        <RosterTab classId={cls.id} />
      </TabsContent>
      <TabsContent value="assignments">
        <ClassAssignmentsTab classId={cls.id} className={cls.name} />
      </TabsContent>
      <TabsContent value="attendance">
        <ClassAttendanceTab classId={cls.id} />
      </TabsContent>
      <TabsContent value="materials">
        <ClassMaterialsTab classId={cls.id} />
      </TabsContent>
      <TabsContent value="settings">
        <ClassSettingsTab cls={cls} />
      </TabsContent>
    </Tabs>
  );
}
