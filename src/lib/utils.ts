import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert a local datetime string (e.g. from <input type="datetime-local">)
// or a Date instance to a UTC ISO string without milliseconds: YYYY-MM-DDTHH:mm:ssZ
export const toUtcIsoString = (input?: string | Date | null): string | undefined => {
  if (!input) return undefined;

  // If it's already a Date, convert directly
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return undefined;
    const iso = input.toISOString();
    return `${iso.slice(0, 19)}Z`;
  }

  // If it's a string:
  const value = input.trim();
  if (!value) return undefined;

  // Handle strings already containing timezone or Z
  // new Date(value) will parse correctly and toISOString() yields UTC
  const parsed = new Date(value);

  // If parsing failed, try to interpret "YYYY-MM-DDTHH:mm" strictly as local time
  if (isNaN(parsed.getTime())) {
    // Try manual parse for formats like "YYYY-MM-DDTHH:mm" or "YYYY-MM-DD HH:mm"
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (match) {
      const [, y, m, d, hh, mm, ss] = match;
      const local = new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        ss ? Number(ss) : 0,
        0
      );
      const iso = local.toISOString();
      return `${iso.slice(0, 19)}Z`;
    }
    return undefined;
  }

  const iso = parsed.toISOString();
  return `${iso.slice(0, 19)}Z`;
}
