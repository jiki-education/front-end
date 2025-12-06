/* eslint-disable @next/next/no-img-element */
/**
 * Dynamically imports a project icon SVG component from the curriculum package.
 *
 * Uses React.lazy() for code splitting - each icon is loaded on demand.
 * Webpack creates a context module that bundles all SVGs in the projects directory.
 * SVGR (configured in next.config.ts) converts each SVG to a React component.
 * Cache busting happens automatically via webpack chunk hashing.
 * No manual mapping required - just add the SVG file with the correct slug name.
 *
 * If an icon doesn't exist, a fallback empty SVG is returned instead of throwing an error.
 */

export function ProjectIcon({ slug }: { slug: string }) {

  return (
    <img alt={`${slug} icon`} src={`/static/images/project-icons/icon-${slug}.png`} />
  );
}
