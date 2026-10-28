"use client";

import * as React from "react";

import {
  AssignmentsTable,
  MOCK_STUDENT_ASSIGNMENTS,
} from "@/app/student/assignments/assignments-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_CONFIG = [
  { value: "todo", label: "To do", emptyTitle: "Nothing to do" },
  { value: "submitted", label: "Submitted", emptyTitle: "Nothing submitted under these filters" },
  { value: "graded", label: "Graded", emptyTitle: "Nothing graded under these filters" },
] as const;

type AssignmentTabValue = (typeof TAB_CONFIG)[number]["value"];

export default function AssignmentsPage() {
  const [tab, setTab] = React.useState<AssignmentTabValue>("todo");

  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const assignment of MOCK_STUDENT_ASSIGNMENTS) {
      map[assignment.status] = (map[assignment.status] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Assignments
        </h2>
        <p className="text-sm text-muted-foreground">
          Everything your teachers have assigned, due and graded.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as AssignmentTabValue)}>
        <div className="overflow-x-auto pb-1 max-sm:-mx-4 max-sm:px-4">
          <TabsList className="inline-flex max-sm:w-full">
            {TAB_CONFIG.map((config) => (
              <TabsTrigger key={config.value} value={config.value}>
                {config.label}
                <span className="ml-1.5 rounded-full bg-secondary px-1.5 text-[10px] text-muted-foreground">
                  {counts[config.value] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {TAB_CONFIG.map((config) => (
          <TabsContent key={config.value} value={config.value} className="mt-4">
            <AssignmentsTable
              data={MOCK_STUDENT_ASSIGNMENTS.filter(
                (assignment) => assignment.status === config.value,
              )}
              emptyTitle={config.emptyTitle}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
