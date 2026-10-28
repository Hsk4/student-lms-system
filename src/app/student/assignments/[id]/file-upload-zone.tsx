"use client";

import * as React from "react";
import { FileUp, Paperclip, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/format";

const ALLOWED_EXTENSIONS = ["pdf", "docx", "png", "jpg", "jpeg", "zip"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadValidationError {
  type: "format" | "size" | null;
  message: string | null;
}

function validateFile(file: File): UploadValidationError {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      type: "format",
      message:
        "That file format is not supported. Use PDF, DOCX, PNG, JPG or ZIP.",
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      type: "size",
      message: "That file is too large. The maximum size is 5 MB.",
    };
  }
  return { type: null, message: null };
}

interface FileUploadZoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export function FileUploadZone({
  file,
  onChange,
  disabled = false,
  className,
}: FileUploadZoneProps) {
  const [error, setError] = React.useState<UploadValidationError>({
    type: null,
    message: null,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const accept = React.useMemo(
    () => ALLOWED_EXTENSIONS.map((extension) => `.${extension}`).join(","),
    [],
  );

  const handleFiles = (files: FileList | null) => {
    const picked = files?.[0];
    if (!picked) return;
    const validation = validateFile(picked);
    if (validation.message) {
      setError(validation);
      return;
    }
    setError({ type: null, message: null });
    onChange(picked);
  };

  const removeFile = () => {
    onChange(null);
    setError({ type: null, message: null });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-accent"
            : "border-border bg-secondary/40",
          disabled && "pointer-events-none opacity-60",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(event.dataTransfer.files);
        }}
      >
        {file ? (
          <React.Fragment>
            <span className="flex items-center gap-2 text-sm text-foreground">
              <Paperclip className="h-4 w-4 shrink-0" />
              <span className="truncate font-medium">{file.name}</span>
              <span className="text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeFile}
            >
              <X />
              Remove
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary shadow-sm">
              <FileUp className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              Drag &amp; drop your file here, or
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Choose file
            </Button>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX, PNG, JPG or ZIP · up to 5 MB
            </p>
          </React.Fragment>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
          aria-label="Choose assignment file"
          disabled={disabled}
        />
      </div>

      {error.message ? (
        <p
          role="alert"
          className="mt-2 text-sm text-red-700 dark:text-red-300"
        >
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
