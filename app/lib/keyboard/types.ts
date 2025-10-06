export type KeyboardHandler = (event: KeyboardEvent) => void;

export interface ShortcutOptions {
  scope?: string;
  description?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
  throttle?: number; // Throttle handler execution in milliseconds
  debounce?: number; // Debounce handler execution in milliseconds
}

export interface RegisteredShortcut {
  keys: string;
  handler: KeyboardHandler;
  options: ShortcutOptions;
}

export interface NormalizedKeyCombo {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

export type Platform = "mac" | "windows" | "linux";
