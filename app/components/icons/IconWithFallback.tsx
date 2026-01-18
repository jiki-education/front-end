import { lazy, Suspense, type ComponentType, type SVGProps } from "react";

function IconFallback() {
  return <svg width={48} height={48} />;
}

type IconType = "badges" | "concepts" | "projects" | "exercises";

// Cache to prevent creating new lazy components on every render
const iconCache = new Map<string, ComponentType<SVGProps<SVGSVGElement>>>();

/**
 * Dynamically imports an icon SVG component.
 *
 * Uses React.lazy() for code splitting - each icon is loaded on demand.
 * Results are cached to prevent memory leaks and ensure stable component references.
 * SVGR (configured in next.config.ts) converts each SVG to a React component.
 *
 * If an icon doesn't exist, a fallback empty SVG is returned instead of throwing an error.
 */
function getIcon(type: IconType, slug: string): ComponentType<SVGProps<SVGSVGElement>> {
  const key = `${type}/${slug}`;
  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      lazy(() =>
        import(`../../icons/${type}/${slug}.svg`).catch(() => {
          // If icon doesn't exist, return a fallback empty SVG component
          return { default: IconFallback };
        })
      )
    );
  }
  return iconCache.get(key)!;
}

export interface IconProps {
  slug: string;
  width?: number;
  height?: number;
}

interface IconWithFallbackProps extends IconProps {
  type: IconType;
}

export function IconWithFallback({ type, slug, width = 48, height = 48 }: IconWithFallbackProps) {
  const IconComponent = getIcon(type, slug);

  return (
    <Suspense fallback={<IconFallback />}>
      <IconComponent width={width} height={height} />
    </Suspense>
  );
}
