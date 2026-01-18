import { IconWithFallback, type IconProps } from "./IconWithFallback";
import Fallback from "../../icons/concepts/fallback.svg";

export function ConceptIcon({ slug, width = 48, height = 48 }: IconProps) {
  return <IconWithFallback type="concepts" slug={slug} fallback={Fallback} width={width} height={height} />;
}
