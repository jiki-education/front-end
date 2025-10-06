import type { NormalizedKeyCombo, Platform } from "./types";

export function getPlatform(): Platform {
  if (typeof window === "undefined") {
    return "mac";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform ? window.navigator.platform.toLowerCase() : "";

  if (platform.includes("mac") || userAgent.includes("mac")) {
    return "mac";
  }
  if (platform.includes("win") || userAgent.includes("win")) {
    return "windows";
  }
  return "linux";
}

export function normalizeKey(key: string): string {
  const keyMap: Record<string, string> = {
    escape: "Escape",
    esc: "Escape",
    enter: "Enter",
    return: "Enter",
    space: " ",
    spacebar: " ",
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    delete: "Delete",
    del: "Delete",
    backspace: "Backspace",
    tab: "Tab",
    pageup: "PageUp",
    pagedown: "PageDown",
    home: "Home",
    end: "End",
    plus: "+",
    minus: "-",
    equals: "=",
    slash: "/",
    backslash: "\\",
    comma: ",",
    period: ".",
    semicolon: ";",
    quote: "'",
    "bracket-left": "[",
    "bracket-right": "]"
  };

  const normalized = key.toLowerCase();

  // Handle function keys
  if (/^f\d{1,2}$/.test(normalized)) {
    return normalized.toUpperCase();
  }

  // Handle single letters/numbers
  if (normalized.length === 1) {
    return normalized;
  }

  return keyMap[normalized] || key;
}

export function parseShortcut(shortcut: string): NormalizedKeyCombo {
  const parts = shortcut.toLowerCase().split(/[\s+]+/);
  const platform = getPlatform();

  let ctrlKey = false;
  let metaKey = false;
  let altKey = false;
  let shiftKey = false;
  let key = "";

  for (const part of parts) {
    switch (part) {
      case "ctrl":
      case "control":
        ctrlKey = true;
        break;
      case "cmd":
      case "command":
      case "meta":
        metaKey = true;
        break;
      case "alt":
      case "option":
        altKey = true;
        break;
      case "shift":
        shiftKey = true;
        break;
      case "mod":
        // "mod" is cmd on Mac, ctrl on Windows/Linux
        if (platform === "mac") {
          metaKey = true;
        } else {
          ctrlKey = true;
        }
        break;
      default:
        key = normalizeKey(part);
    }
  }

  return { key, ctrlKey, metaKey, altKey, shiftKey };
}

export function getKeyComboFromEvent(event: KeyboardEvent): string {
  const parts: string[] = [];

  if (event.ctrlKey) {
    parts.push("ctrl");
  }
  if (event.metaKey) {
    parts.push("cmd");
  }
  if (event.altKey) {
    parts.push("alt");
  }
  if (event.shiftKey) {
    parts.push("shift");
  }

  // Get the actual key pressed
  let key = event.key;

  // Normalize all keys to lowercase
  if (key.length === 1) {
    key = key.toLowerCase();
  } else {
    key = key.toLowerCase();
  }

  parts.push(key);

  return parts.join("+");
}

export function matchesShortcut(event: KeyboardEvent, combo: NormalizedKeyCombo): boolean {
  // Check modifier keys
  if (event.ctrlKey !== combo.ctrlKey) {
    return false;
  }
  if (event.metaKey !== combo.metaKey) {
    return false;
  }
  if (event.altKey !== combo.altKey) {
    return false;
  }
  if (event.shiftKey !== combo.shiftKey) {
    return false;
  }

  // Check the actual key
  const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const comboKey = combo.key.length === 1 ? combo.key.toLowerCase() : combo.key;

  return eventKey === comboKey || event.key === combo.key;
}

export function formatShortcutForDisplay(shortcut: string): string {
  const platform = getPlatform();
  const parts = shortcut.split(/[\s+]+/);

  const displayParts = parts.map((part) => {
    const lower = part.toLowerCase();
    switch (lower) {
      case "cmd":
      case "command":
      case "meta":
        return platform === "mac" ? "⌘" : "Ctrl";
      case "ctrl":
      case "control":
        return platform === "mac" ? "⌃" : "Ctrl";
      case "alt":
      case "option":
        return platform === "mac" ? "⌥" : "Alt";
      case "shift":
        return platform === "mac" ? "⇧" : "Shift";
      case "enter":
      case "return":
        return platform === "mac" ? "⏎" : "Enter";
      case "escape":
      case "esc":
        return "Esc";
      case "space":
      case "spacebar":
        return "Space";
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "left":
        return "←";
      case "right":
        return "→";
      case "delete":
      case "del":
        return platform === "mac" ? "⌫" : "Del";
      case "backspace":
        return platform === "mac" ? "⌫" : "Backspace";
      case "tab":
        return platform === "mac" ? "⇥" : "Tab";
      default:
        // Capitalize single letters
        if (lower.length === 1) {
          return lower.toUpperCase();
        }
        // Capitalize first letter of words
        return part.charAt(0).toUpperCase() + part.slice(1);
    }
  });

  return displayParts.join(platform === "mac" ? "" : "+");
}
