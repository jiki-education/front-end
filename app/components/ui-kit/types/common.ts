/**
 * Common types and interfaces for UI Kit components
 */

import type { ReactNode } from "react";
import type { ColorVariant } from "./colors";

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
 * Props for components with color variants
 */
export interface ColorVariantProps {
  /**
   * Color variant for the component
   */
  color?: ColorVariant;
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
 * Standard event handler types
 */
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type FocusHandler = (event: React.FocusEvent<HTMLElement>) => void;

/**
 * Animation duration constants
 */
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  shake: 500,
  spin: 600
} as const;

/**
 * Common CSS transition classes
 */
export const TRANSITION_CLASSES = {
  all: "transition-all duration-300 ease-in-out",
  colors: "transition-colors duration-200 ease-in-out",
  transform: "transition-transform duration-300 ease-in-out",
  opacity: "transition-opacity duration-300 ease-in-out"
} as const;
