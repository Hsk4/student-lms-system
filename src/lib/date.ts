export function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function daysBetween(value: string): number {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return Number.MAX_SAFE_INTEGER;
  const diff = Date.now() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function matchesDateRange(value: string, range: string): boolean {
  if (range === "all") return true;
  const age = daysBetween(value);
  if (range === "7d") return age <= 7;
  if (range === "30d") return age <= 30;
  if (range === "quarter") return age <= 90;
  return true;
}
