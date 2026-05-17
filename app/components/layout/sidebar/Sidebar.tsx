"use client";

import Image from "next/image";
import FolderIcon from "@/icons/folder.svg";
import BrainLightningIcon from "@/icons/brain-lightning.svg";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import MedalIcon from "@/icons/medal.svg";
import ProjectsIcon from "@/icons/projects.svg";
import SettingsIcon from "@/icons/settings.svg";
import type { ComponentType } from "react";
import { MODAL_TRIGGERS } from "@/lib/analytics";
import { useAuthStore } from "@/lib/auth/authStore";
import { showPremiumUpgradeModal } from "@/lib/modal";
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
  id: string;
  label: string;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
  showPremiumPill?: boolean;
}> = [
  { id: "learn", label: "Coding Fundamentals", href: "/dashboard", icon: BrainLightningIcon },
  { id: "build", label: "Build with Jeremy", href: "/build", icon: LearningComputerIcon },
  { id: "projects", label: "Projects", href: "/projects", icon: ProjectsIcon, showPremiumPill: true },
  { id: "concepts", label: "Concept Library", href: "/concepts", icon: FolderIcon },
  { id: "achievements", label: "Achievements", href: "/achievements", icon: MedalIcon },
  { id: "settings", label: "Settings", href: "/settings", icon: SettingsIcon }
];

export default function Sidebar({ activeItem = "blog" }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const isPremium = user && tierIncludes(user.membership_type, "premium");
  const { launching, handleClick } = useRocketLaunch(() => showPremiumUpgradeModal(MODAL_TRIGGERS.UPGRADE_CTA_NAV), {
    resetAfterLaunch: true
  });

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
              isUserPremium={Boolean(isPremium)}
            />
          ))}
          <MoreMenu isActive={activeItem === "more"} />
        </ul>
      </nav>

      {!isPremium && (
        <button className={`nav-upsell ${rocket.bounceOnHover}`} onClick={handleClick} type="button">
          <p>
            You&apos;re currently on the free plan. <span className="upgrade-text">Upgrade to Premium</span> to
            accelerate your learning&nbsp;
            <span className={`inline-block align-middle ${rocket.rocketWrapper} ${launching ? rocket.launching : ""}`}>
              <Image
                src="/static/images/landing-page/rocket.svg"
                alt=""
                width={16}
                height={16}
                className={rocket.rocket}
              />
            </span>
          </p>
        </button>
      )}
    </aside>
  );
}
