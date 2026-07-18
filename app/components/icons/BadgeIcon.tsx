import type { IconProps } from "./IconWithFallback";
import { staticAsset, hasStaticAsset } from "@/lib/static-asset";

const FALLBACK = "icons/badges/fallback.svg";

export function BadgeIcon({ slug, width = "100%", height = "100%" }: IconProps) {
  const key = `icons/badges/${slug}.svg`;
  const src = staticAsset(hasStaticAsset(key) ? key : FALLBACK);
  return (
    // Content-hashed SVG icons looked up by slug (see lib/generated/asset-hashes.ts),
    // not suitable for next/image optimization
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={width}
      height={height}
      alt=""
      onError={(e) => {
        e.currentTarget.src = staticAsset(FALLBACK);
      }}
    />
  );
}
