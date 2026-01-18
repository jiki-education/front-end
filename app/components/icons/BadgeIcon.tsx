import { IconWithFallback, type IconProps } from "./IconWithFallback";
import Fallback from "../../icons/badges/fallback.svg";

export function BadgeIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="badges" slug={slug} fallback={Fallback} width={width} height={height} />;
}
