import { IconWithFallback, type IconProps } from "./IconWithFallback";
import Fallback from "../../icons/projects/fallback.svg";

export function ProjectIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="projects" slug={slug} fallback={Fallback} width={width} height={height} />;
}
