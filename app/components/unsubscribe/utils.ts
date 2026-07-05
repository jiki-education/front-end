import { NOTIFICATION_TYPES } from "@/lib/notifications/config";

export function formatKeyName(key: string): string {
  return NOTIFICATION_TYPES.find((type) => type.slug === key)?.shortLabel ?? "these";
}
