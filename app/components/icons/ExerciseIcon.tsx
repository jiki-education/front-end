import { IconWithFallback, type IconProps } from "./IconWithFallback";
import Fallback from "../../icons/exercises/fallback.svg";

export function ExerciseIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="exercises" slug={slug} fallback={Fallback} width={width} height={height} />;
}
