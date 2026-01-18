/**
 * Button Component Types
 */

import type { ReactNode, ButtonHTMLAttributes } from "react";
import type { BaseUIProps, DisableableProps, LoadingProps, IconProps, FullWidthProps, Size } from "../types";

/**
 * Button style variants
 */
export type ButtonVariant = "primary" | "secondary";

/**
 * Props for the Button component
 */
export interface ButtonProps
  extends
    BaseUIProps,
    DisableableProps,
    LoadingProps,
    IconProps,
    FullWidthProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  /**
   * Button style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'large'
   */
  size?: Size;

  /**
   * Button content
   */
  children: ReactNode;
}
