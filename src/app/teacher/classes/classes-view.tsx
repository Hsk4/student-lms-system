"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Plus, Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getClassesForTeacher, getClassRoster } from "@/app/teacher/mock/data";
import { formatDateTime } from "@/lib/format";
import { CreateClassDialog } from "@/app/teacher/classes/create-class-dialog";

export function ClassesView() {
  const load = useMockPageLoad();
  const [batch, setBatch] = React.useState<"current" | "previous">("current");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [createdNames, setCreatedNames] = React.useState<string[]>([]);

  const classes = React.useMemo(() => getClassesForTeacher(batch), [batch]);

  if (load.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-16 w-64 animate-pulse rounded-lg bg-secondary" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load your classes." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Classes</h2>
          <p className="text-sm text-muted-foreground">
            Group classes you teach, with rosters and schedules.
          </p>
        </div>
        {batch === "current" ? (
          <Button type="button" onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
            <Plus />
            Create class
          </Button>
        ) : null}
      </div>

      <Tabs value={batch} onValueChange={(value) => setBatch(value as "current" | "previous")}>
        <TabsList>
          <TabsTrigger value="current">Current batches</TabsTrigger>
          <TabsTrigger value="previous">Previous batches</TabsTrigger>
        </TabsList>
      </Tabs>

      {classes.length === 0 ? (
        <EmptyState
          title="No classes yet"
          description={
            batch === "current"
              ? "Create one to group students and schedule sessions."
              : "Finished batches will be archived here with their final averages."
          }
          action={
            batch === "current" ? (
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                <Plus />
                Create class
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((cls) => {
            const enrolled = getClassRoster(cls.id).length;
            const fillPercent = Math.round((enrolled / cls.capacity) * 100);
            return (
              <Card key={cls.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">{cls.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {cls.subject} · {cls.level} · {cls.board.replace(" Board", "")}
                      </p>
                    </div>
                    {cls.status === "previous" ? (
                      <Badge variant="secondary">Archived</Badge>
                    ) : null}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {enrolled}/{cls.capacity} students
                      </span>
                      <span>{fillPercent}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, fillPercent)}%` }}
                      />
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {cls.schedule}
                  </p>

                  {cls.status === "previous" ? (
                    <div className="mt-auto rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                      Completed {formatDateTime(cls.completedOn ?? "")} · Final average{" "}
                      <span className="font-medium text-foreground">{cls.finalAveragePercent}%</span>
                    </div>
                  ) : (
                    <p className="mt-auto text-xs text-muted-foreground">
                      Next session:{" "}
                      <span className="font-medium text-foreground">
                        {formatDateTime(cls.nextSessionAt)}
                      </span>
                    </p>
                  )}

                  <Button asChild size="sm" variant={cls.status === "previous" ? "outline" : "default"}>
                    <Link href={`/teacher/classes/${cls.id}`}>
                      {cls.status === "previous" ? "View" : "Open"}
                      <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
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

      <CreateClassDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={(name) => setCreatedNames((current) => [...current, name])}
      />
      {/* createdNames kept for future local-state rendering of new classes */}
      <span className="hidden">{createdNames.length}</span>
    </div>
  );
}
