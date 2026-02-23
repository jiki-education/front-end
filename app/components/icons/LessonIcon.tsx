import type { IconProps } from "./IconWithFallback";

export function LessonIcon({ slug, width = 48, height = 48 }: IconProps) {
  return (
    // These are small SVG icons loaded by slug, not suitable for next/image optimization
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/static/icons/lessons/${slug}.svg`}
      width={width}
      height={height}
      alt=""
      onError={(e) => {
        e.currentTarget.src = "/static/icons/lessons/fallback.svg";
      }}
    />
  );
}
