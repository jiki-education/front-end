import { format } from "date-fns";

/**
 * Utility functions for the UI Kit
 */

/**
 * Formats a date string to "15th Nov 2025" format
 */
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "do MMM yyyy");
}

/**
 * Formats a string to be used as a CSS class name
 */
export function toClassName(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generates a unique ID for use in form components
 */
export function generateId(prefix = "ui"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
