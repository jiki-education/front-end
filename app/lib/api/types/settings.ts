/**
 * Settings API Types
 * Type definitions for user settings and related operations
 */

import type { NotificationField, NotificationSlug } from "@/lib/notifications/config";

export type { NotificationSlug };

export type UserSettings = {
  name: string;
  handle: string;
  email: string;
  unconfirmed_email: string | null;
  email_confirmed: boolean;
  locale: string;
  streaks_enabled: boolean;
} & Record<NotificationField, boolean>;

export interface SettingsResponse {
  settings: UserSettings;
}

export interface SettingsError {
  error: {
    type: "validation_error" | "invalid_password" | "not_found";
    message: string;
    errors?: Record<string, string[]>;
  };
}

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
