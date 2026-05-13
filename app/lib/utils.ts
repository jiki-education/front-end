import { format } from "date-fns";

/**
 * Formats a date string to "15th Nov 2025" format
 */
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "do MMM yyyy");
}
