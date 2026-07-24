// Development-only settings (BYOK key, provider endpoint, agent model),
// persisted to localStorage and editable from the DebugDrawer's Controls tab.

import { createStore } from "zustand/vanilla";

export type LlmEndpoint = "opencode-zen" | "openrouter";

interface DevSettings {
  llmKey: string;
  endpoint: LlmEndpoint;
  model: string;
}

interface ProviderConfig {
  label: string;
  baseUrl: string;
  // Providers without browser CORS support are routed through the dev-only
  // same-origin relay at /dev/project-builder/api/llm.
  viaDevRelay: boolean;
  suggestedModels: string[];
}

const STORAGE_KEY = "jiki_dev_settings_v2";

export const PROVIDERS: Record<LlmEndpoint, ProviderConfig> = {
  "opencode-zen": {
    label: "OpenCode Zen",
    baseUrl: "https://opencode.ai/zen/v1/chat/completions",
    viaDevRelay: true,
    suggestedModels: [
      "deepseek-v4-flash-free",
      "mimo-v2.5-free",
      "nemotron-3-ultra-free",
      "north-mini-code-free",
      "claude-haiku-4-5",
      "claude-sonnet-4-6",
      "gemini-3-flash"
    ]
  },
  openrouter: {
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    viaDevRelay: false,
    suggestedModels: [
      "qwen/qwen3-coder:free",
      "anthropic/claude-haiku-4.5",
      "anthropic/claude-sonnet-4.5",
      "google/gemini-2.5-flash",
      "deepseek/deepseek-chat-v3.1"
    ]
  }
};

const DEFAULTS: DevSettings = {
  llmKey: process.env.NEXT_PUBLIC_LLM_API_KEY ?? "",
  endpoint: "opencode-zen",
  model: "deepseek-v4-flash-free"
};

function load(): DevSettings {
  if (typeof window === "undefined") {
    return DEFAULTS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULTS;
    }
    const parsed = JSON.parse(raw) as Partial<DevSettings>;
    return {
      llmKey: parsed.llmKey || DEFAULTS.llmKey,
      endpoint: parsed.endpoint && parsed.endpoint in PROVIDERS ? parsed.endpoint : DEFAULTS.endpoint,
      model: parsed.model || DEFAULTS.model
    };
  } catch {
    return DEFAULTS;
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
