"use client";

import * as React from "react";
import { Archive, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TeacherClass } from "@/app/teacher/mock/types";

export function ClassSettingsTab({ cls }: { cls: TeacherClass }) {
  const [name, setName] = React.useState(cls.name);
  const [schedule, setSchedule] = React.useState(cls.schedule);
  const [capacity, setCapacity] = React.useState(String(cls.capacity));
  const [meetingLink, setMeetingLink] = React.useState(cls.meetingLink);
  const [saving, setSaving] = React.useState(false);

  const handleSave = () => {
    // handleUpdateClassSettings — replace with a real API call later.
    setSaving(true);
    window.setTimeout(() => setSaving(false), 600);
  };

  return (
    <div className="flex max-w-xl flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="space-y-1.5">
        <Label htmlFor="settings-name">Class name</Label>
        <Input id="settings-name" value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="settings-schedule">Schedule</Label>
        <Input
          id="settings-schedule"
          value={schedule}
          onChange={(event) => setSchedule(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="settings-capacity">Capacity</Label>
        <Input
          id="settings-capacity"
          type="number"
          min={1}
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="settings-link">Meeting link</Label>
        <Input
          id="settings-link"
          value={meetingLink}
          onChange={(event) => setMeetingLink(event.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" className="text-destructive hover:text-destructive">
          <Archive />
          Archive class
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          <Save />
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
