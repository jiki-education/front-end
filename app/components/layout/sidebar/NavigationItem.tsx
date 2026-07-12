import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ComponentType } from "react";
import TickCircleIcon from "@/icons/tick-circle.svg";
import PremiumStarIcon from "@/icons/premium-star.svg";

interface NavigationItemProps {
  id: string;
  label: string;
  isActive: boolean;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
  showPremiumPill?: boolean;
  isUserPremium?: boolean;
  external?: boolean;
  onClick?: () => void;
}

export function NavigationItem({
  id,
  label,
  isActive,
  href,
  icon: Icon,
  showPremiumPill,
  isUserPremium,
  external,
  onClick
}: NavigationItemProps) {
  const t = useTranslations("layout.sidebar");
  const content = (
    <>
      {Icon && (
        <span className="nav-icon">
          <Icon />
        </span>
      )}
      <span>{label}</span>
      {showPremiumPill && (
        <span className="premium-pill" aria-label={t("premiumPill")}>
          <PremiumStarIcon className="premium-pill-star" />
          {isUserPremium && <TickCircleIcon className="premium-pill-tick" />}
        </span>
      )}
    </>
  );

  const className = `nav-item ${isActive ? "active" : ""}`;

  return (
    <li>
      {onClick ? (
        <button type="button" onClick={onClick} className={className} data-nav-id={id} data-label={label}>
          {content}
        </button>
      ) : external ? (
        <a
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          data-nav-id={id}
          data-label={label}
        >
          {content}
        </a>
      ) : (
        <Link href={href || "#"} className={className} data-nav-id={id} data-label={label}>
          {content}
        </Link>
      )}
    </li>
  );
}
