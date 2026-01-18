"use client";

/**
 * Settings Store
 * Zustand store for managing user settings state
 */

import { create } from "zustand";
import { settingsApi } from "@/lib/api/settings";
import type {
  UserSettings,
  UpdateSettingParams,
  UpdateNotificationParams,
  NotificationSlug
} from "@/lib/api/types/settings";
import toast from "react-hot-toast";

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: Error | null;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSetting: (params: UpdateSettingParams) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateEmail: (email: string, sudoPassword: string) => Promise<void>;
  updatePassword: (newPassword: string, sudoPassword: string) => Promise<void>;
  updateLocale: (locale: string) => Promise<void>;
  updateHandle: (handle: string) => Promise<void>;
  updateNotification: (params: UpdateNotificationParams) => Promise<void>;
  clearCache: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    // Don't refetch if we already have settings and not in error state
    if (get().settings && !get().error) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const settings = await settingsApi.getSettings();
      set({ settings, loading: false });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to fetch settings");
      set({ error: errorObj, loading: false });
      toast.error(errorObj.message);
    }
  },

  updateSetting: async (params: UpdateSettingParams) => {
    const { settings: currentSettings } = get();
    if (!currentSettings) {
      return;
    }

    // Optimistic update for non-sensitive fields
    const requiresSudo = params.field === "email" || params.field === "password";

    if (!requiresSudo) {
      // Apply optimistic update
      const optimisticSettings = { ...currentSettings };

      switch (params.field) {
        case "name":
          optimisticSettings.name = params.value;
          break;
        case "handle":
          optimisticSettings.handle = params.value;
          break;
        case "locale":
          optimisticSettings.locale = params.value;
          break;
        case "email":
        case "password":
          // These require sudo, handled separately
          break;
      }

      set({ settings: optimisticSettings });
    }

    try {
      const updatedSettings = await settingsApi.updateSetting(params);
      set({ settings: updatedSettings });

      // Show success message
      const fieldLabels: Record<string, string> = {
        name: "Name",
        email: "Email",
        password: "Password",
        locale: "Language preference",
        handle: "Handle"
      };

      toast.success(`${fieldLabels[params.field] || params.field} updated successfully`);
    } catch (error) {
      // Rollback optimistic update on error
      if (!requiresSudo) {
        set({ settings: currentSettings });
      }

      const errorMessage = error instanceof Error ? error.message : "Update failed";
      toast.error(errorMessage);
      throw error; // Re-throw for component-level handling
    }
  },

  updateName: async (name: string) => {
    return get().updateSetting({ field: "name", value: name });
  },

  updateEmail: async (email: string, sudoPassword: string) => {
    return get().updateSetting({ field: "email", value: email, sudoPassword });
  },

  updatePassword: async (newPassword: string, sudoPassword: string) => {
    return get().updateSetting({ field: "password", value: newPassword, sudoPassword });
  },

  updateLocale: async (locale: string) => {
    return get().updateSetting({ field: "locale", value: locale });
  },

  updateHandle: async (handle: string) => {
    return get().updateSetting({ field: "handle", value: handle });
  },

  updateNotification: async ({ slug, value }: UpdateNotificationParams) => {
    const { settings: currentSettings } = get();
    if (!currentSettings) {
      return;
    }

    // Map slug to field name for optimistic update
    const fieldMap: Record<NotificationSlug, keyof UserSettings> = {
      product_updates: "receive_product_updates",
      event_emails: "receive_event_emails",
      milestone_emails: "receive_milestone_emails",
      activity_emails: "receive_activity_emails"
    };

    const field = fieldMap[slug];

    // Optimistic update
    const optimisticSettings = {
      ...currentSettings,
      [field]: value
    };
    set({ settings: optimisticSettings });

    try {
      const updatedSettings = await settingsApi.updateNotification({ slug, value });
      set({ settings: updatedSettings });

      // Silent success for toggles (no toast needed)
    } catch (error) {
      // Rollback on error
      set({ settings: currentSettings });

      const errorMessage = error instanceof Error ? error.message : "Failed to update notification preference";
      toast.error(errorMessage);
      throw error;
    }
  },

  clearCache: () => {
    set({ settings: null, loading: false, error: null });
  }
}));

// Helper hook for checking if settings are loaded
export const useSettingsLoaded = () => {
  const { settings, loading, fetchSettings } = useSettingsStore();

  // Fetch on mount if not loaded
  if (!settings && !loading) {
    void fetchSettings();
  }

  return { settings, loading };
};
