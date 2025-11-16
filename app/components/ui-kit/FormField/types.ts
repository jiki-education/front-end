/**
 * FormField Component Types
 */

import type { InputHTMLAttributes } from "react";
import type { BaseUIProps, Size } from "../types";
import type { IconName } from "../icon-types";

/**
 * Props for the FormField component
 */
export interface FormFieldProps extends BaseUIProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
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
   * Icon name to display in the form field
   * Icon color changes from gray-500 to blue-500 on focus
   */
  iconName?: IconName;
}
