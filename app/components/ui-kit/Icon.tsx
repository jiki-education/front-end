"use client";

/**
 * SVGR-based Icon System
 *
 * Icons are imported as React components and rendered directly.
 * SVGs use currentColor, which is set via the text-* Tailwind classes.
 * Each icon is lazy-loaded for optimal code-splitting.
 * To add a new icon: just drop an SVG file into /icons/
 *
 * Usage:
 *   <Icon name="email" size={24} color="blue-500" />
 *   <Icon name="user" className="hover:text-red-500" />
 *   <div className="text-gray-600"><Icon name="lock" /></div>
 */

import { lazy, Suspense, useMemo } from "react";
import type { IconName } from "./icon-types";

export interface IconProps {
  name: IconName;
  size: number;
  className?: string;
  alt?: string;
  color?: string;
}

export function Icon({ name, size, className = "", alt, color }: IconProps) {
  // Lazy load the icon component for code-splitting (memoized by name)
  const IconComponent = useMemo(() => lazy(() => import(`@/icons/${name}.svg`)), [name]);

  // Build className with optional color
  const combinedClassName = color ? `text-${color} ${className}` : className;
  const ariaLabel = alt || `${name} icon`;

  // Props for the icon component
  const iconProps = {
    width: size,
    height: size,
    className: combinedClassName,
    "aria-label": ariaLabel,
    role: "img" as const
  };

  return (
    <Suspense fallback={<svg {...iconProps} />}>
      <IconComponent {...iconProps} />
    </Suspense>
  );
}
