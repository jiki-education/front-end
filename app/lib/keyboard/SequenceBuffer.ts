/**
 * Manages keyboard sequence/chord detection
 */
export class SequenceBuffer {
  private buffer: string[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly TIMEOUT = 1000; // 1 second for chord sequences

  /**
   * Add a key combo to the sequence buffer
   * @param keyCombo - The key combination to add
   * @returns The current sequence as a string if buffer has items, null otherwise
   */
  add(keyCombo: string): string | null {
    // Clear existing timer
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Check if this is a complex modifier combination
    const hasComplexModifiers = keyCombo.includes("ctrl") || keyCombo.includes("cmd") || keyCombo.includes("alt");

    if (!hasComplexModifiers) {
      // Add to buffer for simple keys
      this.buffer.push(keyCombo);

      // Keep only last few keys
      if (this.buffer.length > 4) {
        this.buffer.shift();
      }

      // Set timer to clear buffer
      this.timer = setTimeout(() => {
        this.clear();
      }, this.TIMEOUT);

      return this.getSequence();
    }
    // Complex modifier pressed, clear the buffer
    this.clear();
    return null;
  }

  /**
   * Get the current sequence as a space-separated string
   */
  getSequence(): string | null {
    return this.buffer.length > 0 ? this.buffer.join(" ") : null;
  }

  /**
   * Clear the sequence buffer
   */
  clear(): void {
    this.buffer = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Check if the buffer has any sequences
   */
  hasSequence(): boolean {
    return this.buffer.length > 0;
  }

  /**
   * Destroy and clean up
   */
  destroy(): void {
    this.clear();
  }
}
