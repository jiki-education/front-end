/**
 * Settings API Types
 * Type definitions for user settings and related operations
 */

export interface UserSettings {
  name: string;
  handle: string;
  email: string;
  unconfirmed_email: string | null;
  email_confirmed: boolean;
  locale: string;
  receive_product_updates: boolean;
  receive_event_emails: boolean;
  receive_milestone_emails: boolean;
  receive_activity_emails: boolean;
  streaks_enabled: boolean;
}

export interface SettingsResponse {
  settings: UserSettings;
}

export interface SettingsUpdateRequest {
  value: string | boolean;
  sudo_password?: string;
}

export interface SettingsError {
  error: {
    type: "validation_error" | "invalid_password" | "not_found";
    message: string;
    errors?: Record<string, string[]>;
  };
}

export type NotificationSlug = "product_updates" | "event_emails" | "milestone_emails" | "activity_emails";

export const NOTIFICATION_FIELD_MAP: Record<NotificationSlug, keyof UserSettings> = {
  product_updates: "receive_product_updates",
  event_emails: "receive_event_emails",
  milestone_emails: "receive_milestone_emails",
  activity_emails: "receive_activity_emails"
};

export type SettingField = "name" | "email" | "password" | "locale" | "handle";

export interface UpdateSettingParams {
  field: SettingField;
  value: string;
  sudoPassword?: string;
}

export interface UpdateNotificationParams {
  slug: NotificationSlug;
  value: boolean;
}
