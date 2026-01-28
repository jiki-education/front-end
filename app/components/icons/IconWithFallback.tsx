import { lazy, Suspense, type ComponentType, type SVGProps } from "react";

type IconType = "badges" | "concepts" | "profile" | "projects" | "exercises";

// Cache to prevent creating new lazy components on every render
const iconCache = new Map<string, ComponentType<SVGProps<SVGSVGElement>>>();

/**
 * Dynamically imports an icon SVG component.
 *
 * Uses React.lazy() for code splitting - each icon is loaded on demand.
 * Results are cached to prevent memory leaks and ensure stable component references.
 * SVGR (configured in next.config.ts) converts each SVG to a React component.
 *
 * If an icon doesn't exist, the provided fallback is used instead.
 */
function getIcon(
  type: IconType,
  slug: string,
  Fallback: ComponentType<SVGProps<SVGSVGElement>>
): ComponentType<SVGProps<SVGSVGElement>> {
  const key = `${type}/${slug}`;
  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      lazy(() =>
        import(`../../icons/${type}/${slug}.svg`).catch(() => ({
          default: Fallback
        }))
      )
    );
  }
  return iconCache.get(key)!;
}

export interface IconProps {
  slug: string;
  width?: number | string;
  height?: number | string;
}

interface IconWithFallbackProps extends IconProps {
  type: IconType;
  fallback: ComponentType<SVGProps<SVGSVGElement>>;
}

/* Next16: eslint-disable react-hooks/static-components */
// getIcon returns a cached lazy component - the iconCache ensures stable references across renders
export function IconWithFallback({ type, slug, fallback: Fallback, width = 48, height = 48 }: IconWithFallbackProps) {
  const IconComponent = getIcon(type, slug, Fallback);

  const widthPx = typeof width === "number" ? `${width}px` : width;
  const heightPx = typeof height === "number" ? `${height}px` : height;

  return (
    <Suspense fallback={<div style={{ width: widthPx, height: heightPx }} />}>
      <IconComponent width={width} height={height} />
    </Suspense>
  );
}
/* Next16: eslint-enable react-hooks/static-components */
