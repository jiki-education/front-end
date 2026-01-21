import Fallback from "../../icons/badges/fallback.svg";
import { IconWithFallback, type IconProps } from "./IconWithFallback";

export function BadgeIcon({ slug, width = "100%", height = "100%" }: IconProps) {
  return <IconWithFallback type="badges" slug={slug} fallback={Fallback} width={width} height={height} />;
}
