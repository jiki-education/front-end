import { useRouter } from "next/navigation";
import type { ComponentType } from "react";

interface NavigationItemProps {
  id: string;
  label: string;
  isActive: boolean;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
}

export function NavigationItem({ label, isActive, href, icon: Icon }: NavigationItemProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    }
  };

  return (
    <li>
      <a href={href || "#"} onClick={handleClick} className={`nav-item ${isActive ? "active" : ""}`}>
        {Icon && (
          <span className="nav-icon">
            <Icon />
          </span>
        )}
        <span>{label}</span>
      </a>
    </li>
  );
}
