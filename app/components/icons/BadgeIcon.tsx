import type { IconProps } from "./IconWithFallback";

export function BadgeIcon({ slug, width = "100%", height = "100%" }: IconProps) {
  return (
    // These are small SVG icons loaded by slug, not suitable for next/image optimization
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/static/icons/badges/${slug}.svg`}
      width={width}
      height={height}
      alt=""
      onError={(e) => {
        e.currentTarget.src = "/static/icons/badges/fallback.svg";
      }}
    />
  );
}
