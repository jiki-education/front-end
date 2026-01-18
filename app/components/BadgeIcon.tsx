import { lazy, Suspense, type ComponentType, type SVGProps } from "react";

function IconFallback() {
  return <svg width={48} height={48} />;
}

/**
 * Dynamically imports a badge icon SVG component.
 *
 * Uses React.lazy() for code splitting - each icon is loaded on demand.
 * Webpack creates a context module that bundles all SVGs in the badges directory.
 * SVGR (configured in next.config.ts) converts each SVG to a React component.
 * Cache busting happens automatically via webpack chunk hashing.
 * No manual mapping required - just add the SVG file with the correct slug name.
 *
 * If an icon doesn't exist, a fallback empty SVG is returned instead of throwing an error.
 */
function getBadgeIcon(badgeSlug: string): ComponentType<SVGProps<SVGSVGElement>> {
  return lazy(() =>
    import(`../icons/badges/${badgeSlug}.svg`).catch(() => {
      // If icon doesn't exist, return a fallback empty SVG component
      return { default: IconFallback };
    })
  );
}

interface BadgeIconProps {
  slug: string;
  width?: number;
  height?: number;
}

export function BadgeIcon({ slug, width = 48, height = 48 }: BadgeIconProps) {
  const IconComponent = getBadgeIcon(slug);

  return (
    <Suspense fallback={<IconFallback />}>
      <IconComponent width={width} height={height} />
    </Suspense>
  );
}
