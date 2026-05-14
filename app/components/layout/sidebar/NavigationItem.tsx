import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    }
  };

  return (
    <li>
      <a href={href || "#"} onClick={handleClick} className={`nav-item ${isActive ? "active" : ""}`} data-label={label}>
        {Icon && (
          <span className="nav-icon">
            <Icon />
          </span>
        )}
        <span>{label}</span>
        {showPremiumPill && (
          <span className="premium-pill">
            Premium
            {isUserPremium && <TickCircleIcon className="premium-pill-tick" />}
          </span>
        )}
      </a>
    </li>
  );
}
