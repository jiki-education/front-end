// Base class for all exercises

import { type Messages, type Translator, createTranslator } from "./i18n/translator";

export abstract class Exercise {
  id: string;

  // Translator bound to the injected single-locale message dict. Defaults to an
  // empty translator (returns the key) until the app injects the dict via
  // `setMessages`. The exercise never knows the locale code — it is handed the
  // already-resolved-for-that-locale dict.
  private translator: Translator = createTranslator();

  constructor() {
    this.id = Math.random().toString(36).substring(2, 11);
  }

  /**
   * Inject this exercise's message dict for the student's locale. The app fetches
   * the per-locale dict from R2 and calls this after construction. Rebuilds the
   * translator so `t` resolves against the injected dict.
   */
  public setMessages(messages: Messages): void {
    this.translator = createTranslator(messages);
  }

  /**
   * Resolve a key against the injected dict, interpolating `{{var}}` params.
   * Returns the key unchanged when no dict has been injected yet. Public so
   * scenario `expectations` functions can resolve `errorHtml` against the same
   * injected dict (they receive the exercise instance).
   */
  public t(key: string, params?: Record<string, unknown>): string {
    return this.translator(key, params);
  }
}
