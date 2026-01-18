import { IconWithFallback, type IconProps } from "./IconWithFallback";

export function ProjectIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="projects" slug={slug} width={width} height={height} />;
}
