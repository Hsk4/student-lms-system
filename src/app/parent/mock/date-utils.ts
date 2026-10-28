import { dateIn, formatDateTime, formatDateOnly, formatRs } from "@/lib/format";

export { dateIn, formatDateTime, formatDateOnly, formatRs };

export function daysAgoDate(days: number, hour?: number, minute?: number): string {
  if (hour !== undefined) {
    return dateIn(-days, hour, minute ?? 0);
  }
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(17, 0, 0, 0);
  return date.toISOString();
}
