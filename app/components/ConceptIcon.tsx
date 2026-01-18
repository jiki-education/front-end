import { lazy, Suspense, type ComponentType, type SVGProps } from "react";

function IconFallback() {
  return <svg width={48} height={48} />;
}

/**
 * Dynamically imports a concept icon SVG component.
 *
 * Uses React.lazy() for code splitting - each icon is loaded on demand.
 * Webpack creates a context module that bundles all SVGs in the concepts directory.
 * SVGR (configured in next.config.ts) converts each SVG to a React component.
 * Cache busting happens automatically via webpack chunk hashing.
 * No manual mapping required - just add the SVG file with the correct slug name.
 *
 * If an icon doesn't exist, a fallback empty SVG is returned instead of throwing an error.
 */
function getConceptIcon(conceptSlug: string): ComponentType<SVGProps<SVGSVGElement>> {
  return lazy(() =>
    import(`../icons/concepts/${conceptSlug}.svg`).catch(() => {
      // If icon doesn't exist, return a fallback empty SVG component
      return { default: IconFallback };
    })
  );
}

interface ConceptIconProps {
  slug: string;
  width?: number;
  height?: number;
}

export function ConceptIcon({ slug, width = 48, height = 48 }: ConceptIconProps) {
  const IconComponent = getConceptIcon(slug);

  return (
    <Suspense fallback={<IconFallback />}>
      <IconComponent width={width} height={height} />
    </Suspense>
  );
}
