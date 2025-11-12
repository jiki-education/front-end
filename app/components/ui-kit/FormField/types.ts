/**
 * FormField Component Types
 */

import type { ReactNode, InputHTMLAttributes } from "react";
import type { BaseUIProps, IconProps, Size } from "../types";

/**
 * Props for the FormField component
 */
export interface FormFieldProps extends BaseUIProps, IconProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Label text for the form field
   */
  label: string;

  /**
   * Error message to display (shows error state when provided)
   */
  error?: string;

  /**
   * Size of the form field
   * @default 'large'
   */
  size?: Size;

  /**
   * Focused icon (shown when field is focused)
   * If not provided, the main icon will be used
   */
  focusedIcon?: ReactNode;
}
