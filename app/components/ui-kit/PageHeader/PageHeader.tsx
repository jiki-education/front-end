/**
 * PageHeader Component
 *
 * Standard page header with icon, title, and optional subtitle.
 * Used at the top of main content areas.
 */

import type { PageHeaderProps } from "./types";

export function PageHeader({ title, subtitle, icon, className = "", ...props }: PageHeaderProps) {
  const containerClasses = ["mb-6", className].filter(Boolean).join(" ");

  const titleClasses = [
    "text-[34px] font-semibold mb-[13px] text-gray-950",
    "flex items-center gap-3",
    // Text wrap balance for better line breaks
    "text-balance"
  ].join(" ");

  const iconClasses = ["w-[34px] h-[34px] flex-shrink-0 text-blue-500"].join(" ");

  const subtitleClasses = [
    "text-[18px] text-gray-600 mb-0",
    // Text wrap balance for better line breaks
    "text-balance"
  ].join(" ");

  return (
    <header className={containerClasses} {...props}>
      {/* Title with optional icon */}
      <h1 className={titleClasses}>
        {icon && <span className={iconClasses}>{icon}</span>}
        {title}
      </h1>

      {/* Optional subtitle */}
      {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
    </header>
  );
}
