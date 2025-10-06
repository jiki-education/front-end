import React from "react";
import { showModal } from "../modal";
import { KeyboardHelpModal } from "./KeyboardHelpModal";
import { PerformanceMonitor, debounce, throttle } from "./PerformanceOptimizer";
import { ScopeManager } from "./ScopeManager";
import { SequenceBuffer } from "./SequenceBuffer";
import { ShortcutRegistry } from "./ShortcutRegistry";
import type { KeyboardHandler, ShortcutOptions } from "./types";
import { getKeyComboFromEvent, parseShortcut } from "./utils";

class KeyboardManager {
  private readonly registry = new ShortcutRegistry();
  private readonly scopes = new ScopeManager();
  private readonly sequence = new SequenceBuffer();
  private readonly performanceMonitor = new PerformanceMonitor();
  private optimizedHandlers = new WeakMap<KeyboardHandler, KeyboardHandler>();
  private isEnabled = true;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize the keyboard manager (safe to call multiple times)
   */
  private init(): void {
    if (this.isInitialized || typeof window === "undefined") {
      return;
    }

    // Use capture phase to intercept before other handlers
    window.addEventListener("keydown", this.handleKeyDown, true);

    // Clean up on page unload to prevent memory leaks
    window.addEventListener("beforeunload", this.cleanup);

    this.isInitialized = true;
  }

  /**
   * Cleanup handler for page unload
   */
  private readonly cleanup = (): void => {
    if (!this.isInitialized || typeof window === "undefined") {
      return;
    }

    window.removeEventListener("keydown", this.handleKeyDown, true);
    window.removeEventListener("beforeunload", this.cleanup);
    this.registry.clear();
    this.scopes.clear();
    this.sequence.destroy();
    this.isInitialized = false;
  };

  /**
   * Register a keyboard shortcut
   * @param keys - Shortcut keys (e.g., "cmd+k", "ctrl+shift+p", "g g" for chords)
   * @param handler - Function to call when shortcut is triggered
   * @param options - Additional options for the shortcut
   * @returns Unsubscribe function
   */
  on(keys: string, handler: KeyboardHandler, options: ShortcutOptions = {}): () => void {
    const scope = options.scope || "global";
    const normalizedKeys = this.normalizeKeys(keys);

    // Wrap handler with performance optimization if requested
    let optimizedHandler = handler;

    if (options.throttle) {
      const throttled = throttle(handler, options.throttle);
      this.optimizedHandlers.set(handler, throttled);
      optimizedHandler = throttled;
    } else if (options.debounce) {
      const debounced = debounce(handler, options.debounce);
      this.optimizedHandlers.set(handler, debounced);
      optimizedHandler = debounced;
    }

    const id = this.registry.register(normalizedKeys, keys, optimizedHandler, { ...options, scope });

    // Return unsubscribe function
    return () => {
      // Clean up optimized handler if it exists
      const cached = this.optimizedHandlers.get(handler);
      if (cached && "cancel" in cached) {
        (cached as any).cancel();
        this.optimizedHandlers.delete(handler);
      }
      this.registry.unregister(normalizedKeys, id);
    };
  }

  /**
   * Push a new scope onto the stack
   * @param scope - Scope name to activate
   * @returns Function to remove the scope
   */
  pushScope(scope: string): () => void {
    return this.scopes.push(scope);
  }

  /**
   * Check if a scope is currently active
   */
  isScopeActive(scope: string): boolean {
    return this.scopes.isActive(scope);
  }

  /**
   * Enable or disable all keyboard shortcuts
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Get all registered shortcuts (for help display)
   */
  getShortcuts() {
    return this.registry.getAllShortcuts(this.scopes.getActiveScopes());
  }

  /**
   * Show keyboard shortcuts help modal
   */
  showHelp(): void {
    const shortcuts = this.getShortcuts();

    showModal("info-modal", {
      title: "Keyboard Shortcuts",
      content: React.createElement(KeyboardHelpModal, { shortcuts }),
      buttonText: "Got it"
    });
  }

  /**
   * Normalize shortcut keys for consistent lookup
   */
  private normalizeKeys(keys: string): string {
    // Check if this is a chord sequence (e.g., "g g" or "ctrl+k ctrl+c")
    if (keys.includes(" ") && !keys.includes("+")) {
      // Simple chord like "g g"
      return keys.toLowerCase();
    }

    // For modifier-based shortcuts, normalize
    const combo = parseShortcut(keys);
    const parts: string[] = [];

    if (combo.ctrlKey) {
      parts.push("ctrl");
    }
    if (combo.metaKey) {
      parts.push("cmd");
    }
    if (combo.altKey) {
      parts.push("alt");
    }
    if (combo.shiftKey) {
      parts.push("shift");
    }
    if (combo.key) {
      parts.push(combo.key.toLowerCase());
    }

    return parts.join("+");
  }

  /**
   * Handle keyboard events
   */
  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isEnabled) {
      return;
    }

    // Track event for performance monitoring
    const isHighLoad = this.performanceMonitor.trackEvent();
    if (isHighLoad && process.env.NODE_ENV === "development") {
      console.warn("[Keyboard] Skipping event due to high load");
      return;
    }

    // Skip if user is typing in an input/textarea (unless it's a global shortcut)
    const target = event.target as HTMLElement | undefined;

    const isTyping =
      target && typeof target.matches === "function" && target.matches("input, textarea, [contenteditable=true]");

    // Build the key combo from the event
    const keyCombo = getKeyComboFromEvent(event);

    // Update sequence buffer and check for chord sequences
    this.sequence.add(keyCombo);

    // Try to find handlers for current key combo
    let handlers = this.registry.getHandlers(keyCombo);

    // Also check the sequence buffer for chord matches
    if (!handlers && this.sequence.hasSequence()) {
      const sequence = this.sequence.getSequence();
      if (sequence) {
        handlers = this.registry.getHandlers(sequence);

        if (handlers) {
          // Clear buffer after successful chord match
          this.sequence.clear();
        }
      }
    }

    if (!handlers) {
      return;
    }

    // Execute all matching handlers
    handlers.forEach((shortcut) => {
      // Check if scope is active
      if (!this.scopes.isActive(shortcut.options.scope || "global")) {
        return;
      }

      // Skip if typing and not explicitly enabled for inputs
      if (isTyping && !shortcut.options.enabled) {
        return;
      }

      // Check if shortcut is enabled
      if (shortcut.options.enabled === false) {
        return;
      }

      // Prevent default if requested
      if (shortcut.options.preventDefault !== false) {
        event.preventDefault();
      }

      if (shortcut.options.stopPropagation) {
        event.stopPropagation();
      }

      // Call the handler
      try {
        shortcut.handler(event);
      } catch (error) {
        console.error(`[Keyboard] Error in handler for ${shortcut.keys}:`, error);
      }
    });
  };

  /**
   * Clean up event listeners and reset state
   */
  destroy(): void {
    // Cancel all optimized handlers
    this.optimizedHandlers = new WeakMap();
    this.performanceMonitor.reset();
    this.cleanup();
  }

  /**
   * Re-initialize after destroy (useful for hot reload)
   */
  reinit(): void {
    this.cleanup();
    this.init();
  }
}

// Create singleton instance
let keyboardInstance: KeyboardManager | null = null;

// Cleanup on hot reload in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // @ts-ignore - Development-only property for hot reload cleanup
  const existingInstance = (window as any).__keyboard_instance;
  if (existingInstance && typeof existingInstance.destroy === "function") {
    existingInstance.destroy();
  }
}

// Create new instance
keyboardInstance = new KeyboardManager();

// Store reference for hot reload cleanup (development only)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // @ts-ignore - Development-only property for hot reload cleanup
  (window as any).__keyboard_instance = keyboardInstance;
}

export const keyboard = keyboardInstance;

// Convenience exports
export const on = keyboard.on.bind(keyboard);
export const pushScope = keyboard.pushScope.bind(keyboard);
export const setEnabled = keyboard.setEnabled.bind(keyboard);
export const showKeyboardHelp = keyboard.showHelp.bind(keyboard);

// Export hook
export { useKeyboard } from "./useKeyboard";

// Export types
export type { KeyboardHandler, RegisteredShortcut, ShortcutOptions } from "./types";
