// Development-only settings (BYOK key, agent model), persisted to localStorage
// and editable from the DebugDrawer's Controls tab.

import { createStore } from "zustand/vanilla";

interface DevSettings {
  openrouterKey: string;
  model: string;
}

const STORAGE_KEY = "jiki_dev_settings_v1";

export const DEFAULT_MODEL = "qwen/qwen3-coder:free";

export const SUGGESTED_MODELS = [
  "qwen/qwen3-coder:free",
  "anthropic/claude-haiku-4.5",
  "anthropic/claude-sonnet-4.5",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "deepseek/deepseek-chat-v3.1"
];

function load(): DevSettings {
  const defaults: DevSettings = {
    openrouterKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "",
    model: DEFAULT_MODEL
  };
  if (typeof window === "undefined") {
    return defaults;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw) as Partial<DevSettings>;
    return {
      openrouterKey: parsed.openrouterKey || defaults.openrouterKey,
      model: parsed.model || defaults.model
    };
  } catch {
    return defaults;
  }
}

export const devSettingsStore = createStore<DevSettings>(() => load());

export function updateDevSettings(update: Partial<DevSettings>): void {
  devSettingsStore.setState(update);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(devSettingsStore.getState()));
  } catch {
    // localStorage unavailable - settings just won't persist
  }
}
