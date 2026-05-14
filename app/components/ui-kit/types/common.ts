/**
 * Common types and interfaces for UI Kit components
 */

import type { CSSProperties } from "react";

/**
 * Base props that most UI components will accept
 */
export interface BaseUIProps {
  /**
   * Additional CSS class names to apply
   */
  className?: string;

  /**
   * Inline styles (use sparingly, prefer className)
   */
  style?: CSSProperties;

  /**
   * Test identifier for automated testing
   */
  "data-testid"?: string;
}
