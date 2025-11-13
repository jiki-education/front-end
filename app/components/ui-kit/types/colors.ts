/**
 * Color system types for UI Kit
 * Based on the design system color palette
 */

export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type BlueColor = `blue-${ColorScale}`;
export type PurpleColor = `purple-${ColorScale}`;
export type GreenColor = `green-${ColorScale}`;
export type GrayColor = `gray-${ColorScale}`;

export type UIColor = BlueColor | PurpleColor | GreenColor | GrayColor | "error-500";

/**
 * Semantic color variants for components
 */
export type ColorVariant = "blue" | "purple" | "green" | "gray";

/**
 * Color mapping for different UI states
 */
export interface UIColors {
  primary: BlueColor;
  secondary: GrayColor;
  success: GreenColor;
  warning: PurpleColor;
  error: "error-500";
}

/**
 * Shadow color types
 */
export type ShadowColor = "blue-shadow" | "blue-shadow-hover" | "shadow-subtle";
