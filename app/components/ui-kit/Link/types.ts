/**
 * Link Component Types
 */

import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { BaseUIProps } from "../types";

/**
 * Props for the Link component
 */
export interface LinkProps extends BaseUIProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link content
   */
  children: ReactNode;
}
