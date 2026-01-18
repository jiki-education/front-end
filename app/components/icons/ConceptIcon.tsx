import { IconWithFallback, type IconProps } from "./IconWithFallback";

export function ConceptIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="concepts" slug={slug} width={width} height={height} />;
}
