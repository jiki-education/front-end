/**
 * Simple Icon System
 *
 * Uses Next.js Image component with SVG files from public/icons/
 * To add a new icon: just drop an SVG file into public/icons/
 *
 * Usage:
 *   <Icon name="email" size={24} className="text-blue-500" />
 *   <Icon name="user" size="lg" color="#34b356" />
 */

import type { IconName } from "./icon-types";

export interface IconProps {
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
  className?: string;
  alt?: string;
  color?: string;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40
};

const tailwindColors: Record<string, string> = {
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",
  "blue-900": "#1e3a8a",
  "red-100": "#fee2e2",
  "red-200": "#fecaca",
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-800": "#991b1b",
  "red-900": "#7f1d1d",
  "green-100": "#dcfce7",
  "green-200": "#bbf7d0",
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "green-700": "#15803d",
  "green-800": "#166534",
  "green-900": "#14532d",
  white: "#ffffff",
  black: "#000000"
};

function resolveColor(color: string): string {
  // If it's a hex color (starts with #), return as-is
  if (color.startsWith("#")) {
    return color;
  }

  // Otherwise, look it up in the Tailwind colors map
  return tailwindColors[color] || color;
}

export function Icon({ name, size = "md", className, alt, color = "black" }: IconProps) {
  const pixelSize = typeof size === "number" ? size : sizeMap[size];
  const resolvedColor = resolveColor(color);

  return (
    <div
      style={{
        width: pixelSize,
        height: pixelSize,
        backgroundColor: resolvedColor,
        WebkitMask: `url(/icons/${name}.svg) no-repeat center / contain`,
        mask: `url(/icons/${name}.svg) no-repeat center / contain`
      }}
      className={className}
      aria-label={alt || `${name} icon`}
      role="img"
    />
  );
}
