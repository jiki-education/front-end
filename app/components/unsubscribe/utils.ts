import { NOTIFICATION_TYPES, type NotificationSlug } from "@/lib/notifications/config";

/** Resolve an email-preferences key to a known notification slug, or `null` if unknown. */
export function notificationSlugForKey(key: string): NotificationSlug | null {
  return NOTIFICATION_TYPES.find((type) => type.slug === key)?.slug ?? null;
}
