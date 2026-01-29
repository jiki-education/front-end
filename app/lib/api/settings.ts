"use client";

/**
 * Settings API Module
 * Handles all user settings-related API interactions
 */

import { api, ApiError } from "./client";
import type {
  UserSettings,
  SettingsResponse,
  SettingsError,
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

    try {
      const response = await api.patch<SettingsResponse>(`/internal/settings/${field}`, body);
      return response.data.settings;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorData = error.data as SettingsError | undefined;

        if (errorData?.error) {
          // Create a more specific error message
          if (errorData.error.type === "invalid_password") {
            throw new Error("Current password is incorrect");
          }

          if (errorData.error.type === "validation_error" && errorData.error.errors) {
            // Format validation errors
            const messages = Object.entries(errorData.error.errors)
              .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
              .join("; ");
            throw new Error(messages);
          }

          throw new Error(errorData.error.message);
        }
      }
      throw error;
    }
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
    try {
      const response = await api.patch<SettingsResponse>(`/internal/settings/notifications/${slug}`, { value });
      return response.data.settings;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorData = error.data as SettingsError | undefined;

        if (errorData?.error) {
          throw new Error(errorData.error.message);
        }
      }
      throw error;
    }
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
    try {
      const response = await api.patch<SettingsResponse>("/internal/settings/streaks", { enabled });
      return response.data.settings;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorData = error.data as SettingsError | undefined;

        if (errorData?.error) {
          throw new Error(errorData.error.message);
        }
      }
      throw error;
    }
  }
}

// Export singleton instance
export const settingsApi = new SettingsApi();

// Export convenience functions
export const {
  getSettings,
  updateSetting,
  updateName,
  updateEmail,
  updatePassword,
  updateLocale,
  updateHandle,
  updateNotification,
  updateNotifications,
  updateStreaks
} = settingsApi;
