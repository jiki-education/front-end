import type { IconProps } from "./IconWithFallback";
import { staticAsset, hasStaticAsset } from "@/lib/static-asset";

const FALLBACK = "icons/challenges/fallback.svg";

export function ChallengeIcon({ slug, width = 48, height = 48 }: IconProps) {
  const key = `icons/challenges/${slug}.svg`;
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
