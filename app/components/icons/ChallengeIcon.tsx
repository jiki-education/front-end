import type { IconProps } from "./IconWithFallback";
import { challengeIconFallbackUrl, challengeIconUrls } from "@/lib/generated/icon-hashes";

export function ChallengeIcon({ slug, width = 48, height = 48 }: IconProps) {
  const src = challengeIconUrls[slug] ?? challengeIconFallbackUrl;
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
        e.currentTarget.src = challengeIconFallbackUrl;
      }}
    />
  );
}
