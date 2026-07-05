/**
 * Email notification preferences — single source of truth.
 *
 * Every preference is identified by its API slug. The two APIs name the same
 * preference differently:
 *   - `/internal/settings` stores it as `receive_<slug>` (see `notificationField`)
 *   - `/external/email_preferences/:token` returns it as `<slug>`
 *
 * Adding a new preference type is a single entry in `NOTIFICATION_TYPES` (plus
 * the settings copy under `settings.notifications` in the message catalogues).
 */

export interface NotificationType {
  /** API slug, e.g. "newsletters". */
  slug: string;
  /** Key used to build the settings-tab i18n keys (`<id>Title` / `<id>Description`). */
  settingsI18nId: string;
  /** Title shown on the external (logged-out) unsubscribe page. */
  title: string;
  /** Description shown on the external unsubscribe page. */
  description: string;
  /** Human label used in the one-click unsubscribe confirmation copy. */
  shortLabel: string;
}

export const NOTIFICATION_TYPES = [
  {
    slug: "newsletters",
    settingsI18nId: "features",
    title: "Product Updates",
    description: "Stay informed about new features and improvements.",
    shortLabel: "product updates"
  },
  {
    slug: "event_emails",
    settingsI18nId: "livestreams",
    title: "Event Notifications",
    description: "Get notified about upcoming livestreams and events.",
    shortLabel: "event notifications"
  },
  {
    slug: "milestone_emails",
    settingsI18nId: "milestones",
    title: "Achievement Notifications",
    description: "Receive notifications when you unlock new skills or achievements.",
    shortLabel: "achievement notifications"
  },
  {
    slug: "activity_emails",
    settingsI18nId: "activity",
    title: "Activity Emails",
    description: "Activity-based notifications like unlocking badges and completing challenges.",
    shortLabel: "activity emails"
  },
  {
    slug: "onboarding_emails",
    settingsI18nId: "onboarding",
    title: "Getting-Started Emails",
    description: "Tips and guidance on how to get the most from Jiki.",
    shortLabel: "getting-started emails"
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
