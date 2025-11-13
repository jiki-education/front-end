/**
 * Auto-generated icon types
 * Generated from SVG files in public/icons/
 *
 * To add new icons:
 * 1. Add SVG file to public/icons/
 * 2. Run: node scripts/generate-icon-types.js
 *
 * Available icons: all, complete, email, in-progress, locked, password, user
 */

export type IconName = "all" | "complete" | "email" | "in-progress" | "locked" | "password" | "user";

export const availableIcons: readonly IconName[] = [
  "all",
  "complete",
  "email",
  "in-progress",
  "locked",
  "password",
  "user"
] as const;

export function isValidIconName(name: string): name is IconName {
  return availableIcons.includes(name as IconName);
}
