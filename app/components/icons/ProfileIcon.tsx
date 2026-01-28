import Fallback from "../../icons/profile/fallback.svg";
import { IconWithFallback, type IconProps } from "./IconWithFallback";

export function ProfileIcon({ slug, width = "100%", height = "100%" }: IconProps) {
  return <IconWithFallback type="profile" slug={slug} fallback={Fallback} width={width} height={height} />;
}
