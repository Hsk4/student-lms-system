"use client";

import * as React from "react";

import { formatDateOnly } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface GradeTrendPoint {
  date: string;
  percent: number;
}

interface GradeTrendChartProps {
  points: GradeTrendPoint[];
  className?: string;
}

export function GradeTrendChart({ points, className }: GradeTrendChartProps) {
  const width = 520;
  const height = 180;
  const padding = 6;

  const values = points.map((point) => point.percent);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100) + 4;
  const span = max - min || 1;

  const stepX = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const coordinates = points.map((point, index) => ({
    x: padding + index * stepX,
    y: height - padding - ((point.percent - min) / span) * (height - padding * 2),
  }));

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");
  const areaPath = points.length
    ? `${linePath} L${(width - padding).toFixed(1)},${height} L${padding},${height} Z`
    : "";
  const last = coordinates[coordinates.length - 1];

  return (
    <figure className={cn("flex aspect-[16/6] w-full items-center justify-center", className)}>
      {points.length === 0 ? (
        <figcaption className="text-sm text-muted-foreground">
          Trend will appear after a few graded items.
        </figcaption>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Grade trend across the term"
        >
          <defs>
            <linearGradient id="grade-trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((line) => (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={height - padding - (((line - min) / span) * (height - padding * 2))}
              y2={height - padding - (((line - min) / span) * (height - padding * 2))}
              strokeDasharray="4 6"
              className="stroke-border"
            />
          ))}
          <path d={areaPath} fill="url(#grade-trend-fill)" />
          <path
            d={linePath}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="stroke-primary"
          />
          {last ? <circle cx={last.x} cy={last.y} r="4" className="fill-primary" /> : null}
        </svg>
      )}
    </figure>
  );
}

export function trendRangeLabel(points: GradeTrendPoint[]): string {
  if (points.length === 0) return "No data";
  const first = points[0].date;
  const lastPoint = points[points.length - 1].date;
  return `${formatDateOnly(first)} – ${formatDateOnly(lastPoint)}`;
}
