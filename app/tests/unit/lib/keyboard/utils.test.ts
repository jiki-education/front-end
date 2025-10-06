import {
  getPlatform,
  normalizeKey,
  parseShortcut,
  getKeyComboFromEvent,
  matchesShortcut,
  formatShortcutForDisplay
} from "@/lib/keyboard/utils";

describe("Keyboard Utils", () => {
  describe("getPlatform", () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, "navigator", {
        value: originalNavigator,
        writable: true,
        configurable: true
      });
    });

    it("should detect Mac platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)", platform: "MacIntel" },
        writable: true,
        configurable: true
      });

      expect(getPlatform()).toBe("mac");
    });

    it("should detect Windows platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (Windows NT 10.0)", platform: "Win32" },
        writable: true,
        configurable: true
      });

      expect(getPlatform()).toBe("windows");
    });

    it("should default to Linux for unknown platforms", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (X11; Linux)", platform: "Linux x86_64" },
        writable: true,
        configurable: true
      });

      expect(getPlatform()).toBe("linux");
    });
  });

  describe("normalizeKey", () => {
    it("should normalize escape key", () => {
      expect(normalizeKey("escape")).toBe("Escape");
      expect(normalizeKey("esc")).toBe("Escape");
    });

    it("should normalize enter key", () => {
      expect(normalizeKey("enter")).toBe("Enter");
      expect(normalizeKey("return")).toBe("Enter");
    });

    it("should normalize space key", () => {
      expect(normalizeKey("space")).toBe(" ");
      expect(normalizeKey("spacebar")).toBe(" ");
    });

    it("should normalize arrow keys", () => {
      expect(normalizeKey("up")).toBe("ArrowUp");
      expect(normalizeKey("down")).toBe("ArrowDown");
      expect(normalizeKey("left")).toBe("ArrowLeft");
      expect(normalizeKey("right")).toBe("ArrowRight");
    });

    it("should normalize delete keys", () => {
      expect(normalizeKey("delete")).toBe("Delete");
      expect(normalizeKey("del")).toBe("Delete");
      expect(normalizeKey("backspace")).toBe("Backspace");
    });

    it("should handle single letters", () => {
      expect(normalizeKey("a")).toBe("a");
      expect(normalizeKey("Z")).toBe("z");
    });

    it("should handle function keys", () => {
      expect(normalizeKey("f1")).toBe("F1");
      expect(normalizeKey("f12")).toBe("F12");
    });

    it("should handle special characters", () => {
      expect(normalizeKey("plus")).toBe("+");
      expect(normalizeKey("minus")).toBe("-");
      expect(normalizeKey("slash")).toBe("/");
    });
  });

  describe("parseShortcut", () => {
    it("should parse simple key", () => {
      const result = parseShortcut("k");
      expect(result).toEqual({
        key: "k",
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: false
      });
    });

    it("should parse cmd+k", () => {
      const result = parseShortcut("cmd+k");
      expect(result).toEqual({
        key: "k",
        ctrlKey: false,
        metaKey: true,
        altKey: false,
        shiftKey: false
      });
    });

    it("should parse ctrl+shift+s", () => {
      const result = parseShortcut("ctrl+shift+s");
      expect(result).toEqual({
        key: "s",
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: true
      });
    });

    it("should parse alt+enter", () => {
      const result = parseShortcut("alt+enter");
      expect(result).toEqual({
        key: "Enter",
        ctrlKey: false,
        metaKey: false,
        altKey: true,
        shiftKey: false
      });
    });

    it("should handle alternative modifier names", () => {
      expect(parseShortcut("command+k").metaKey).toBe(true);
      expect(parseShortcut("meta+k").metaKey).toBe(true);
      expect(parseShortcut("control+k").ctrlKey).toBe(true);
      expect(parseShortcut("option+k").altKey).toBe(true);
    });
  });

  describe("getKeyComboFromEvent", () => {
    it("should convert simple key event", () => {
      const event = new KeyboardEvent("keydown", { key: "k" });
      expect(getKeyComboFromEvent(event)).toBe("k");
    });

    it("should convert cmd+k event", () => {
      const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
      expect(getKeyComboFromEvent(event)).toBe("cmd+k");
    });

    it("should convert ctrl+shift+s event", () => {
      const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true, shiftKey: true });
      expect(getKeyComboFromEvent(event)).toBe("ctrl+shift+s");
    });

    it("should convert all modifiers", () => {
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        metaKey: true,
        altKey: true,
        shiftKey: true
      });
      expect(getKeyComboFromEvent(event)).toBe("ctrl+cmd+alt+shift+k");
    });

    it("should handle space key", () => {
      const event = new KeyboardEvent("keydown", { key: " " });
      expect(getKeyComboFromEvent(event)).toBe(" ");
    });

    it("should lowercase single character keys", () => {
      const event = new KeyboardEvent("keydown", { key: "K" });
      expect(getKeyComboFromEvent(event)).toBe("k");
    });
  });

  describe("matchesShortcut", () => {
    it("should match simple key", () => {
      const event = new KeyboardEvent("keydown", { key: "k" });
      const combo = { key: "k", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false };
      expect(matchesShortcut(event, combo)).toBe(true);
    });

    it("should match cmd+k", () => {
      const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
      const combo = { key: "k", ctrlKey: false, metaKey: true, altKey: false, shiftKey: false };
      expect(matchesShortcut(event, combo)).toBe(true);
    });

    it("should not match when modifiers differ", () => {
      const event = new KeyboardEvent("keydown", { key: "k" });
      const combo = { key: "k", ctrlKey: false, metaKey: true, altKey: false, shiftKey: false };
      expect(matchesShortcut(event, combo)).toBe(false);
    });

    it("should not match when key differs", () => {
      const event = new KeyboardEvent("keydown", { key: "k" });
      const combo = { key: "s", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false };
      expect(matchesShortcut(event, combo)).toBe(false);
    });

    it("should match escape key", () => {
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      const combo = { key: "Escape", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false };
      expect(matchesShortcut(event, combo)).toBe(true);
    });
  });

  describe("formatShortcutForDisplay", () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, "navigator", {
        value: originalNavigator,
        writable: true,
        configurable: true
      });
    });

    it("should format cmd+k for Mac", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Macintosh", platform: "MacIntel" },
        writable: true,
        configurable: true
      });

      expect(formatShortcutForDisplay("cmd+k")).toBe("⌘K");
    });

    it("should format cmd+k for Windows", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Windows", platform: "Win32" },
        writable: true,
        configurable: true
      });

      expect(formatShortcutForDisplay("cmd+k")).toBe("Ctrl+K");
    });

    it("should format ctrl+s for Mac", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Macintosh", platform: "MacIntel" },
        writable: true,
        configurable: true
      });

      expect(formatShortcutForDisplay("ctrl+s")).toBe("⌃S");
    });

    it("should format shift+alt+d", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Macintosh", platform: "MacIntel" },
        writable: true,
        configurable: true
      });

      expect(formatShortcutForDisplay("shift+alt+d")).toBe("⇧⌥D");
    });

    it("should format arrow keys", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Macintosh", platform: "MacIntel" },
        writable: true,
        configurable: true
      });

      expect(formatShortcutForDisplay("up")).toBe("↑");
      expect(formatShortcutForDisplay("down")).toBe("↓");
      expect(formatShortcutForDisplay("left")).toBe("←");
      expect(formatShortcutForDisplay("right")).toBe("→");
    });

    it("should format escape key", () => {
      expect(formatShortcutForDisplay("escape")).toBe("Esc");
    });

    it("should format enter key", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Macintosh", platform: "MacIntel" },
        writable: true,
        configurable: true
      });

      expect(formatShortcutForDisplay("enter")).toBe("⏎");
    });

    it("should format space key", () => {
      expect(formatShortcutForDisplay("space")).toBe("Space");
    });
  });
});
