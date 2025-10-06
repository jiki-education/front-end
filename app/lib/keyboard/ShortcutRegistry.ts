import type { RegisteredShortcut, KeyboardHandler, ShortcutOptions } from "./types";

/**
 * Registry for managing keyboard shortcuts
 */
export class ShortcutRegistry {
  private readonly shortcuts = new Map<string, Map<symbol, RegisteredShortcut>>();

  /**
   * Register a shortcut
   * @param normalizedKeys - The normalized key combination
   * @param keys - Original key string
   * @param handler - Handler function
   * @param options - Shortcut options
   * @returns Unique ID for the shortcut
   */
  register(normalizedKeys: string, keys: string, handler: KeyboardHandler, options: ShortcutOptions): symbol {
    const id = Symbol("shortcut");

    if (!this.shortcuts.has(normalizedKeys)) {
      this.shortcuts.set(normalizedKeys, new Map());
    }

    this.shortcuts.get(normalizedKeys)!.set(id, {
      keys,
      handler,
      options
    });

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.debug(`[Keyboard] Registered: ${keys}${options.description ? ` - ${options.description}` : ""}`);
    }

    return id;
  }

  /**
   * Unregister a shortcut
   * @param normalizedKeys - The normalized key combination
   * @param id - The shortcut ID
   */
  unregister(normalizedKeys: string, id: symbol): void {
    const handlers = this.shortcuts.get(normalizedKeys);
    if (handlers) {
      handlers.delete(id);
      if (handlers.size === 0) {
        this.shortcuts.delete(normalizedKeys);
      }
    }
  }

  /**
   * Get handlers for a key combination
   * @param normalizedKeys - The normalized key combination
   * @returns Map of handlers or undefined
   */
  getHandlers(normalizedKeys: string): Map<symbol, RegisteredShortcut> | undefined {
    return this.shortcuts.get(normalizedKeys);
  }

  /**
   * Get all registered shortcuts
   * @param activeScopes - Set of currently active scopes
   * @returns Array of registered shortcuts
   */
  getAllShortcuts(activeScopes: Set<string>): RegisteredShortcut[] {
    const shortcuts: RegisteredShortcut[] = [];

    this.shortcuts.forEach((handlers) => {
      handlers.forEach((shortcut) => {
        if (activeScopes.has(shortcut.options.scope || "global")) {
          shortcuts.push(shortcut);
        }
      });
    });

    return shortcuts;
  }

  /**
   * Clear all shortcuts
   */
  clear(): void {
    this.shortcuts.clear();
  }
}
