/**
 * Common types and interfaces for UI Kit components
 */

import type { ReactNode } from "react";

/**
 * Size variants for components
 */
export type Size = "large"; // Extensible for future sizes like 'small' | 'medium' | 'large'

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
  style?: React.CSSProperties;

  /**
   * Test identifier for automated testing
   */
  "data-testid"?: string;
}

/**
 * Props for components that can be disabled
 */
export interface DisableableProps {
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
}

/**
 * Props for components with loading states
 */
export interface LoadingProps {
  /**
   * Whether the component is in a loading state
   */
  loading?: boolean;
}

/**
 * Props for components that accept icons
 */
export interface IconProps {
  /**
   * Icon to display (typically an SVG element)
   */
  icon?: ReactNode;
}

/**
 * Props for components that can span full width
 */
export interface FullWidthProps {
  /**
   * Whether the component should take full width of its container
   */
  fullWidth?: boolean;
}

/**
 * Common CSS transition classes
 */
export const TRANSITION_CLASSES = {
  all: "transition-all duration-300 ease-in-out",
  colors: "transition-colors duration-200 ease-in-out",
  transform: "transition-transform duration-300 ease-in-out",
  opacity: "transition-opacity duration-300 ease-in-out"
} as const;
