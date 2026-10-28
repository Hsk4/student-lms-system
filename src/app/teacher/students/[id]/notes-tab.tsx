"use client";

import * as React from "react";
import { Loader2, Lock, Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getPrivateNotesForStudent } from "@/app/teacher/mock/data";
import type { TeacherPrivateNote } from "@/app/teacher/mock/types";
import { formatDateTime } from "@/lib/format";

export function NotesTab({ studentId }: { studentId: string }) {
  const [notes, setNotes] = React.useState<TeacherPrivateNote[]>(() =>
    getPrivateNotesForStudent(studentId),
  );
  const [draft, setDraft] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const handleAddNote = () => {
    const text = draft.trim();
    if (!text) return;
    // handleAddPrivateNote — replace with a real API call later.
    setSaving(true);
    window.setTimeout(() => {
      setNotes((current) => [
        {
          id: `local-${current.length + 1}`,
          studentId,
          text,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setDraft("");
      setSaving(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Private notes</CardTitle>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Only you can see these notes
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Add a private note about this student…"
            aria-label="New note"
          />
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={handleAddNote}
              disabled={saving || draft.trim().length === 0}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus />}
              {saving ? "Adding…" : "Add note"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Keep teaching observations here — they stay private to you."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <p className="text-sm leading-relaxed text-foreground">{note.text}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDateTime(note.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
