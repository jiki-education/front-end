import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ComponentType } from "react";
import TickCircleIcon from "@/icons/tick-circle.svg";

interface NavigationItemProps {
  id: string;
  label: string;
  isActive: boolean;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
  showPremiumPill?: boolean;
  isUserPremium?: boolean;
}

export function NavigationItem({
  label,
  isActive,
  href,
  icon: Icon,
  showPremiumPill,
  isUserPremium
}: NavigationItemProps) {
  const t = useTranslations("layout.sidebar");
  return (
    <li>
      <Link href={href || "#"} className={`nav-item ${isActive ? "active" : ""}`} data-label={label}>
        {Icon && (
          <span className="nav-icon">
            <Icon />
          </span>
        )}
        <span>{label}</span>
        {showPremiumPill && (
          <span className="premium-pill">
            {t("premiumPill")}
            {isUserPremium && <TickCircleIcon className="premium-pill-tick" />}
          </span>
        )}
      </Link>
    </li>
  );
}
