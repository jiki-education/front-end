/**
 * Link Component
 *
 * Standard link component with primary color and underline on hover.
 * Font size inherits from context.
 */

import { forwardRef } from "react";
import type { LinkProps } from "./types";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, className = "", ...props }, ref) => {
  const linkClasses = [
    "text-blue-500 no-underline font-medium",
    "hover:underline",
    "transition-all duration-200 ease-in-out",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a ref={ref} className={linkClasses} {...props}>
      {children}
    </a>
  );
});

Link.displayName = "Link";
