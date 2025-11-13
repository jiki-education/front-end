/**
 * Utility functions for the UI Kit
 */

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
