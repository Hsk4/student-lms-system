export function formatRs(value: number): string {
  return `Rs ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function upperMeridian(value: string): string {
  return value.replace(/\s?(am|pm)/i, (match) => match.toUpperCase());
}

export function formatDateTime(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  const dayMonth = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${weekday} ${dayMonth}, ${upperMeridian(time)}`;
}

export function formatDateOnly(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  const dayMonth = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  return `${weekday} ${dayMonth}`;
}

export function dateIn(
  days: number,
  hour = 17,
  minute = 0,
): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function formatTimeOnly(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return time.replace(/\s?(am|pm)/i, (match) => match.toUpperCase());
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
