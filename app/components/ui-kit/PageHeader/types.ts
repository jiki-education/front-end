/**
 * PageHeader Component Types
 */

// ReactNode import removed as it's not used in this interface
import type { BaseUIProps, IconProps } from "../types";

/**
 * Props for the PageHeader component
 */
export interface PageHeaderProps extends BaseUIProps, IconProps {
  /**
   * Main title text
   */
  title: string;

  /**
   * Subtitle/description text
   */
  subtitle?: string;
}
