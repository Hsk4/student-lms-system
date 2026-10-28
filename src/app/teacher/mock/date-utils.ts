import { dateIn } from "@/lib/format";

export { dateIn };

export function daysAgoDateTime(days: number, hour = 17, minute = 0): string {
  return dateIn(-days, hour, minute);
}

export function todayAt(hour: number, minute = 0): string {
  const base = new Date();
  base.setHours(hour, minute, 0, 0);
  return base.toISOString();
}
