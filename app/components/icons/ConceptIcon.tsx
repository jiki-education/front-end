import type { IconProps } from "./IconWithFallback";
import { conceptIconFallbackUrl, conceptIconUrls } from "@/lib/generated/concept-icon-hashes";

export function ConceptIcon({ slug, width = 100, height = 100 }: IconProps) {
  const src = conceptIconUrls[slug] ?? conceptIconFallbackUrl;
  return (
    // Concept icons are content-hashed webp images looked up by slug (see
    // lib/generated/concept-icon-hashes.ts), not suitable for next/image optimization
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={width}
      height={height}
      alt=""
      onError={(e) => {
        e.currentTarget.src = conceptIconFallbackUrl;
      }}
    />
  );
}
