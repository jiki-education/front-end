"use client";

/**
 * Settings API Module
 * Handles all user settings-related API interactions
 */

import { api } from "./client";
import type {
  UserSettings,
  SettingsResponse,
  UpdateSettingParams,
  UpdateNotificationParams,
  NotificationSlug
} from "./types/settings";

class SettingsApi {
  /**
   * Get current user settings
   */
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<SettingsResponse>("/internal/settings");
    return response.data.settings;
  }

  /**
   * Update a specific setting field
   */
  async updateSetting({ field, value, sudoPassword }: UpdateSettingParams): Promise<UserSettings> {
    const body: { value: string; sudo_password?: string } = { value };

    if (sudoPassword) {
      body.sudo_password = sudoPassword;
    }

    // The ApiError propagates untouched: it carries the `type` the API sent,
    // and the copy for that type is resolved at the render site.
    const response = await api.patch<SettingsResponse>(`/internal/settings/${field}`, body);
    return response.data.settings;
  }

  /**
   * Update display name
   */
  async updateName(name: string): Promise<UserSettings> {
    return this.updateSetting({ field: "name", value: name });
  }

  /**
   * Update email (requires sudo password)
   */
  async updateEmail(email: string, sudoPassword: string): Promise<UserSettings> {
    return this.updateSetting({ field: "email", value: email, sudoPassword });
  }

  /**
   * Update password (requires sudo password)
   */
  async updatePassword(newPassword: string, sudoPassword: string): Promise<UserSettings> {
    return this.updateSetting({ field: "password", value: newPassword, sudoPassword });
  }

  /**
   * Update language preference
   */
  async updateLocale(locale: string): Promise<UserSettings> {
    return this.updateSetting({ field: "locale", value: locale });
  }

  /**
   * Update unique handle
   */
  async updateHandle(handle: string): Promise<UserSettings> {
    return this.updateSetting({ field: "handle", value: handle });
  }

  /**
   * Update notification preference
   */
  async updateNotification({ slug, value }: UpdateNotificationParams): Promise<UserSettings> {
    const response = await api.patch<SettingsResponse>(`/internal/settings/notifications/${slug}`, { value });
    return response.data.settings;
  }

  /**
   * Batch update multiple notification settings
   */
  async updateNotifications(updates: Array<{ slug: NotificationSlug; value: boolean }>): Promise<UserSettings> {
    let settings: UserSettings | null = null;

    // Update each notification sequentially
    // We could optimize this with a batch endpoint if available
    for (const update of updates) {
      settings = await this.updateNotification(update);
    }

    // Return the final settings state
    // If no updates were made, fetch current settings
    return settings || this.getSettings();
  }

  /**
   * Update streaks enabled setting
   */
  async updateStreaks(enabled: boolean): Promise<UserSettings> {
    const response = await api.patch<SettingsResponse>("/internal/settings/streaks", { enabled });
    return response.data.settings;
  }
}

// Export singleton instance
export const settingsApi = new SettingsApi();
