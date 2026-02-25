"use client";

import FolderIcon from "@static/icons/folder.svg";
import HouseIcon from "@static/icons/house.svg";
import MedalIcon from "@static/icons/medal.svg";
import ProjectsIcon from "@static/icons/projects.svg";
import SettingsIcon from "@static/icons/settings.svg";
import type { ComponentType } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import { tierIncludes } from "@/lib/pricing";
import { Logo } from "./Logo";
import { NavigationItem } from "./NavigationItem";
import { MoreMenu } from "./MoreMenu";

interface SidebarProps {
  activeItem?: string;
}

const navigationItems: Array<{
  id: string;
  label: string;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
  showPremiumPill?: boolean;
}> = [
  { id: "learn", label: "Learn", href: "/dashboard", icon: HouseIcon },
  { id: "projects", label: "Projects", href: "/projects", icon: ProjectsIcon, showPremiumPill: true },
  { id: "concepts", label: "Concepts", href: "/concepts", icon: FolderIcon },
  { id: "achievements", label: "Achievements", href: "/achievements", icon: MedalIcon },
  { id: "settings", label: "Settings", href: "/settings", icon: SettingsIcon }
];

export default function Sidebar({ activeItem = "blog" }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const isPremium = user && tierIncludes(user.membership_type, "premium");

  const handleUpgradeClick = () => {
    showModal(
      "premium-upgrade-modal",
      {},
      premiumModalStyles.premiumModalOverlay,
      premiumModalStyles.premiumModalWidth
    );
  };

  return (
    <aside className="ui-lhs-menu" id="sidebar" data-testid="sidebar">
      <Logo />

      <nav>
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              id={item.id}
              label={item.label}
              isActive={activeItem === item.id}
              href={item.href}
              icon={item.icon}
              showPremiumPill={item.showPremiumPill}
            />
          ))}
          <MoreMenu isActive={activeItem === "more"} />
        </ul>
      </nav>

      {!isPremium && (
        <button className="nav-upsell" onClick={handleUpgradeClick} type="button">
          <p>
            You&apos;re currently on the free plan. <span className="upgrade-text">Upgrade to Premium</span> to
            accelerate your learning&nbsp;<span className="arrow">&rarr;</span>
          </p>
        </button>
      )}
    </aside>
  );
}
