/**
 * Color system types for UI Kit
 * Based on the design system color palette
 */

export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type BlueColor = `blue-${ColorScale}`;
export type PurpleColor = `purple-${ColorScale}`;
export type GreenColor = `green-${ColorScale}`;
export type GrayColor = `gray-${ColorScale}`;

/**
 * Semantic color variants for components
 */
export type ColorVariant = "blue" | "purple" | "green" | "gray";
