"use client";

/**
 * SVGR-based Icon System
 *
 * Icons are imported as React components and rendered directly.
 * SVGs use currentColor. In product code, set the color from the parent via a
 * CSS Module class (`.icon { color: var(--color-blue-500); }`). The `color`
 * prop maps to a Tailwind `text-*` class and is only used on dev/demo pages.
 * Each icon is lazy-loaded for optimal code-splitting.
 * To add a new icon: just drop an SVG file into /icons/
 *
 * Usage:
 *   <span className={styles.icon}><Icon name="lock" size={24} /></span>
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
