import type { IconProps } from "./IconWithFallback";

export function ConceptIcon({ slug, width = 100, height = 100 }: IconProps) {
  return (
    // Concept icons are webp images loaded by slug, not suitable for next/image optimization
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/static/icons/concepts/${slug}.webp`}
      width={width}
      height={height}
      alt=""
      onError={(e) => {
        e.currentTarget.src = "/static/icons/concepts/fallback.webp";
      }}
    />
  );
}
