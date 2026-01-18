import { IconWithFallback, type IconProps } from "./IconWithFallback";

export function BadgeIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="badges" slug={slug} width={width} height={height} />;
}
