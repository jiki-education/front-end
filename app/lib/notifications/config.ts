/**
 * Email notification preferences — single source of truth.
 *
 * Every preference is identified by its API slug. The two APIs name the same
 * preference differently:
 *   - `/internal/settings` stores it as `receive_<slug>` (see `notificationField`)
 *   - `/external/email_preferences/:token` returns it as `<slug>`
 *
 * Adding a new preference type is a single entry in `NOTIFICATION_TYPES` (plus
 * the settings copy under `settings.notifications` and the external unsubscribe
 * copy under `unsubscribe.types.<slug>` in the message catalogues).
 */

export interface NotificationType {
  /** API slug, e.g. "newsletters". */
  slug: string;
  /** Key used to build the settings-tab i18n keys (`<id>Title` / `<id>Description`). */
  settingsI18nId: string;
}

export const NOTIFICATION_TYPES = [
  {
    slug: "newsletters",
    settingsI18nId: "features"
  },
  {
    slug: "event_emails",
    settingsI18nId: "livestreams"
  },
  {
    slug: "milestone_emails",
    settingsI18nId: "milestones"
  },
  {
    slug: "activity_emails",
    settingsI18nId: "activity"
  },
  {
    slug: "onboarding_emails",
    settingsI18nId: "onboarding"
  }
] as const satisfies readonly NotificationType[];

export type NotificationSlug = (typeof NOTIFICATION_TYPES)[number]["slug"];

/** The corresponding `/internal/settings` field, e.g. "receive_newsletters". */
export type NotificationField = `receive_${NotificationSlug}`;

export function notificationField(slug: NotificationSlug): NotificationField {
  return `receive_${slug}`;
}

/** Email preferences as returned by the external email-preferences API. */
export type EmailPreferences = Record<NotificationSlug, boolean>;

/** Build a preferences object with every type set to `value` (used in dev/tests). */
export function buildEmailPreferences(value: boolean): EmailPreferences {
  return Object.fromEntries(NOTIFICATION_TYPES.map((type) => [type.slug, value])) as EmailPreferences;
}
