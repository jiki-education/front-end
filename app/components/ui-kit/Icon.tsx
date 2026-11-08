"use client";

/**
 * SVGR-based Icon System
 *
 * Icons are imported as React components and rendered directly.
 * SVGs use currentColor. The optional `color` prop is a palette token name
 * (e.g. "blue-500", "error-500") mapped to `color: var(--color-<name>)` inline;
 * or set the color from the parent via a CSS Module class
 * (`.icon { color: var(--color-blue-500); }`).
 * Each icon is lazy-loaded for optimal code-splitting.
 * To add a new icon: just drop an SVG file into /icons/
 *
 * Usage:
 *   <Icon name="email" size={24} color="blue-500" />
 *   <span className={styles.icon}><Icon name="lock" size={24} /></span>
 */

import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type SVGProps } from "react";
import type { IconName } from "./icon-types";

export interface IconProps {
  name: IconName;
  size: number;
  className?: string;
  alt?: string;
  color?: string;
}

export function Icon({ name, size, className = "", alt, color }: IconProps) {
  const IconComponent = lazyIcon(name);

  // Color is a palette token name (e.g. "blue-500") applied via currentColor.
  const ariaLabel = alt || `${name} icon`;

  // Props for the icon component
  const iconProps = {
    width: size,
    height: size,
    className,
    style: color ? { color: `var(--color-${color})` } : undefined,
    "aria-label": ariaLabel,
    role: "img" as const
  };

  return (
    <Suspense fallback={<svg {...iconProps} />}>
      <IconComponent {...iconProps} />
    </Suspense>
  );
}

type LazyIcon = LazyExoticComponent<ComponentType<SVGProps<SVGSVGElement>>>;

// Each icon's lazy component is created once per name and shared by every
// mount. A lazy component created during render (e.g. in useMemo) is thrown
// away if the render suspends before the Icon first commits, so React's retry
// would build a new lazy with a new pending import and suspend again. In a
// sync render that cycle runs in microtasks and freezes the page.
const lazyIcons = new Map<IconName, LazyIcon>();

function lazyIcon(name: IconName): LazyIcon {
  let icon = lazyIcons.get(name);
  if (!icon) {
    icon = lazy(() => import(`@/icons/${name}.svg`));
    lazyIcons.set(name, icon);
  }
  return icon;
}
