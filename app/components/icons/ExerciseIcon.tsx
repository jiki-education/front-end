import { IconWithFallback, type IconProps } from "./IconWithFallback";

export function ExerciseIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="exercises" slug={slug} width={width} height={height} />;
}
