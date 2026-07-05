import type { IconProps } from "./IconWithFallback";
import { badgeIconFallbackUrl, badgeIconUrls } from "@/lib/generated/icon-hashes";

export function BadgeIcon({ slug, width = "100%", height = "100%" }: IconProps) {
  const src = badgeIconUrls[slug] ?? badgeIconFallbackUrl;
  return (
    // Content-hashed SVG icons looked up by slug (see lib/generated/icon-hashes.ts),
    // not suitable for next/image optimization
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={width}
      height={height}
      alt=""
      onError={(e) => {
        e.currentTarget.src = badgeIconFallbackUrl;
      }}
    />
  );
}
