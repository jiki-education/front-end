"use client";

import RocketIcon from "@/components/landing-page/icons/rocket.svg";
import FolderIcon from "@/icons/folder.svg";
import BrainLightningIcon from "@/icons/brain-lightning.svg";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import MedalIcon from "@/icons/medal.svg";
import ChallengesIcon from "@/icons/challenges.svg";
import SettingsIcon from "@/icons/settings.svg";
import type { ComponentType } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth/authStore";
import { localePath } from "@/lib/i18n/routes";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { tierIncludes } from "@/lib/pricing";
import rocket from "@/components/landing-page/rocketLaunch.module.css";
import { useRocketLaunch } from "@/components/landing-page/hooks/useRocketLaunch";
import { Logo } from "./Logo";
import { NavigationItem } from "./NavigationItem";
import { MoreMenu } from "./MoreMenu";

interface SidebarProps {
  activeItem?: string;
}

const navigationItems: Array<{
  id: "learn" | "build" | "challenges" | "concepts" | "achievements" | "settings";
  href: string;
  icon?: ComponentType<{ className?: string }>;
  showPremiumPill?: boolean;
}> = [
  { id: "learn", href: "/dashboard", icon: BrainLightningIcon },
  { id: "build", href: "/build", icon: LearningComputerIcon },
  { id: "challenges", href: "/challenges", icon: ChallengesIcon, showPremiumPill: true },
  { id: "concepts", href: "/concepts", icon: FolderIcon },
  { id: "achievements", href: "/achievements", icon: MedalIcon },
  { id: "settings", href: "/settings", icon: SettingsIcon }
];

export default function Sidebar({ activeItem = "blog" }: SidebarProps) {
  const t = useTranslations("layout.sidebar");
  const locale = useLocale();
  const user = useAuthStore((state) => state.user);
  const isPremium = user && tierIncludes(user.membership_type, "premium");
  const { launching, handleClick } = useRocketLaunch(() => showPremiumUpgradeModal("upgrade_cta_nav"), {
    resetAfterLaunch: true
  });

  return (
    <aside className="ui-lhs-menu" id="sidebar" data-testid="sidebar">
      <Logo />

      <nav>
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              id={item.id}
              label={t(`nav.${item.id}`)}
              isActive={activeItem === item.id}
              href={localePath(item.href, locale)}
              icon={item.icon}
              showPremiumPill={item.showPremiumPill}
              isUserPremium={Boolean(isPremium)}
            />
          ))}
          <MoreMenu isActive={activeItem === "more"} />
        </ul>
      </nav>

      {!isPremium && (
        <button className={`nav-upsell ${rocket.bounceOnHover}`} onClick={handleClick} type="button">
          <p>
            {t("upsell.free")} <span className="upgrade-text">{t("upsell.upgrade")}</span> {t("upsell.accelerate")}
            &nbsp;
            <span className={`${rocket.rocketWrapper} ${launching ? rocket.launching : ""}`}>
              <RocketIcon width={16} height={16} className={rocket.rocket} />
            </span>
          </p>
        </button>
      )}
    </aside>
  );
}
