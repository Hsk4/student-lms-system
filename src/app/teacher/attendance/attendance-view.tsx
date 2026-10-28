"use client";

import * as React from "react";
import { CalendarCheck } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import {
  getAttendanceRecord,
  getClassesForTeacher,
  getClassRoster,
} from "@/app/teacher/mock/data";
import type { AttendanceStatus } from "@/app/teacher/mock/types";
import { formatDateOnly } from "@/lib/format";
import {
  SaveAttendanceBar,
  TakeAttendanceRoster,
  type RosterEntry,
} from "@/app/teacher/attendance/take-attendance-roster";
import { AttendanceHistory } from "@/app/teacher/attendance/attendance-history";

export function AttendanceView() {
  const load = useMockPageLoad();
  const classes = React.useMemo(() => getClassesForTeacher("current"), []);
  const [tab, setTab] = React.useState<"take" | "history">("take");
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [classId, setClassId] = React.useState(classes[0]?.id ?? "");
  const [entries, setEntries] = React.useState<RosterEntry[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const selectedClass = classes.find((cls) => cls.id === classId);

  React.useEffect(() => {
    if (!classId) return;
    const roster = getClassRoster(classId);
    const existing = getAttendanceRecord(classId, new Date(`${date}T00:00:00`));
    setEntries(
      roster.map((student) => {
        const found = existing?.entries.find((entry) => entry.studentId === student.id);
        return {
          studentId: student.id,
          name: student.name,
          status: found?.status ?? "present",
          note: found?.note,
        };
      }),
    );
    setSaved(false);
  }, [classId, date]);

  const handleChange = (studentId: string, status: AttendanceStatus, note?: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.studentId === studentId ? { ...entry, status, note: note ?? entry.note } : entry,
      ),
    );
    setSaved(false);
  };

  const handleSave = () => {
    // handleSaveAttendance — replace with a real API call later.
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 700);
  };

  if (load.isLoading) {
    return <LoadingSkeleton rows={7} columns={3} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load attendance." />;
  }

  const presentCount = entries.filter((entry) => entry.status === "present").length;
  const absentCount = entries.filter((entry) => entry.status === "absent").length;

  // Dummy rule: dates older than 7 days become read-only.
  const selectedDate = new Date(`${date}T00:00:00`);
  const ageDays = Math.floor((Date.now() - selectedDate.getTime()) / 86400000);
  const readOnly = ageDays > 7;

  return (
    <div className="flex flex-col gap-5 pb-24 lg:pb-0">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Attendance</h2>
        <p className="text-sm text-muted-foreground">
          Mark attendance with big touch-friendly controls, then review history.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as "take" | "history")}>
        <TabsList>
          <TabsTrigger value="take">Take attendance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "take" ? (
        classes.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No classes yet"
            description="Create a class first — attendance is taken per class session."
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-[170px]"
                aria-label="Session date"
              />
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="w-[240px]" aria-label="Class / session">
                  <SelectValue placeholder="Choose class…" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {readOnly ? (
                <Badge variant="secondary">Read-only (older than 7 days)</Badge>
              ) : null}
              {saved ? <Badge variant="success">Saved</Badge> : null}
            </div>

            {selectedClass ? (
              <p className="text-xs text-muted-foreground">
                {selectedClass.schedule} · Session {formatDateOnly(selectedDate)}
                {ageDays > 0 ? ` (${ageDays} days ago)` : ""}
              </p>
            ) : null}

            {entries.length === 0 ? (
              <EmptyState
                title="No students in this class"
                description="Accept enrollment requests to build the roster first."
              />
            ) : (
              <>
                <TakeAttendanceRoster
                  roster={entries}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
                {!readOnly ? (
                  <SaveAttendanceBar
                    present={presentCount}
                    absent={absentCount}
                    saving={saving}
                    saved={saved}
                    onSave={handleSave}
                  />
                ) : null}
              </>
            )}
          </>
        )
      ) : (
        <AttendanceHistory />
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant={load.simulateError ? "destructive" : "ghost"}
          size="sm"
          onClick={() => load.setSimulateError(!load.simulateError)}
          title="Dev toggle: simulate a failed request on next load"
        >
          Simulate error
        </Button>
      </div>
    </div>
  );
}
