"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useMockPageLoad } from "@/hooks/use-mock-page-load";
import { getClassesForTeacher, getMaterialsForTeacher } from "@/app/teacher/mock/data";
import { MaterialsList } from "@/app/teacher/materials/materials-list";
import { UploadMaterialDialog } from "@/app/teacher/materials/upload-material-dialog";

const FILE_TYPES = [
  { value: "all", label: "All types" },
  { value: "pdf", label: "PDF" },
  { value: "worksheet", label: "Worksheet" },
  { value: "slides", label: "Slides" },
  { value: "video", label: "Video" },
  { value: "link", label: "Link" },
];

export function MaterialsView() {
  const load = useMockPageLoad();
  const [search, setSearch] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [extraItems, setExtraItems] = React.useState<string[]>([]);

  const classes = React.useMemo(() => getClassesForTeacher(), []);
  const materials = React.useMemo(() => {
    const base = getMaterialsForTeacher();
    const extras = extraItems.map((title, index) => ({
      id: `local-${index + 1}`,
      title,
      fileName: `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      fileType: "pdf" as const,
      sizeBytes: 180000,
      courseId: courseFilter !== "all" ? courseFilter : classes[0]?.id ?? "",
      courseLabel: classes[0]?.name ?? "Class",
      uploadedAt: new Date().toISOString(),
    }));
    return [...extras, ...base];
  }, [extraItems, courseFilter, classes]);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return materials.filter((material) => {
      const matchesSearch =
        term.length === 0 ||
        material.title.toLowerCase().includes(term) ||
        material.courseLabel.toLowerCase().includes(term);
      const matchesCourse = courseFilter === "all" || material.courseId === courseFilter;
      const matchesType = typeFilter === "all" || material.fileType === typeFilter;
      return matchesSearch && matchesCourse && matchesType;
    });
  }, [materials, search, courseFilter, typeFilter]);

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("all");
    setTypeFilter("all");
  };

  if (load.isLoading) {
    return <LoadingSkeleton rows={6} columns={3} />;
  }

  if (load.isError) {
    return <ErrorState onRetry={load.retry} description="We could not load your materials." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Materials</h2>
          <p className="text-sm text-muted-foreground">
            Worksheets, notes and recordings shared with your classes.
          </p>
        </div>
        <Button type="button" onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
          <Upload />
          Upload material
        </Button>
      </div>

      <ListToolbar
        searchPlaceholder="Search materials…"
        searchValue={search}
        onSearchChange={setSearch}
        onClear={clearFilters}
        filters={[
          {
            id: "course",
            label: "Class / course",
            options: [
              { value: "all", label: "All classes" },
              ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
            ],
            value: courseFilter,
            onChange: setCourseFilter,
          },
          {
            id: "type",
            label: "File type",
            options: FILE_TYPES,
            value: typeFilter,
            onChange: setTypeFilter,
          },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No materials yet"
          description="Upload worksheets or notes and attach them to a class."
          action={
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              <Upload />
              Upload material
            </Button>
          }
        />
      ) : (
        <MaterialsList items={filtered} />
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

      <UploadMaterialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUploaded={(title) => setExtraItems((current) => [...current, title])}
      />
    </div>
  );
}
