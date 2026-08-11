"use client";

import FolderIcon from "@/icons/folder.svg";
import BrainLightningIcon from "@/icons/brain-lightning.svg";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import MedalIcon from "@/icons/medal.svg";
import ChallengesIcon from "@/icons/challenges.svg";
import StudyBookIcon from "@/icons/study-book.svg";
import VideoLibIcon from "@/icons/video-lib.svg";
import RssIcon from "@/icons/rss.svg";
import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import SettingsIcon from "@/icons/settings.svg";
import HelpIcon from "@/icons/help.svg";
import WavingHandIcon from "@/icons/waving-hand.svg";
import PremiumStarIcon from "@/icons/premium-star.svg";
import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth/authStore";
import { YOUTUBE_URL } from "@/lib/constants/social";
import { forumUrl } from "@/lib/i18n/externalLinks";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { tierIncludes } from "@/lib/pricing";
import { NavigationItem } from "./NavigationItem";

interface SidebarProps {
  activeItem?: string;
}

interface NavItem {
  id:
    | "learn"
    | "build"
    | "challenges"
    | "concepts"
    | "achievements"
    | "guides"
    | "videos"
    | "blog"
    | "forum"
    | "settings"
    | "help";
  href: string;
  icon?: ComponentType<{ className?: string }>;
  showPremiumPill?: boolean;
  external?: boolean;
}

export default function Sidebar({ activeItem = "blog" }: SidebarProps) {
  const t = useTranslations("layout.sidebar");
  const locale = useLocale();
  const routes = useLocaleRoutes();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isPremium = user && tierIncludes(user.membership_type, "premium");

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push(routes.home());
    }
  };

  const navigationGroups: Array<{
    id: "learnToCode" | "learnToBuild" | "community" | "more";
    items: NavItem[];
  }> = [
    {
      id: "learnToCode",
      items: [
        { id: "learn", href: routes.dashboard(), icon: BrainLightningIcon },
        { id: "challenges", href: routes.challenges(), icon: ChallengesIcon },
        { id: "concepts", href: routes.concepts(), icon: FolderIcon }
      ]
    },
    {
      id: "learnToBuild",
      items: [
        { id: "build", href: routes.build(), icon: LearningComputerIcon },
        { id: "guides", href: routes.guides(), icon: StudyBookIcon }
      ]
    },
    {
      id: "community",
      items: [
        { id: "videos", href: YOUTUBE_URL, icon: VideoLibIcon, external: true },
        { id: "blog", href: routes.blog(), icon: RssIcon },
        { id: "forum", href: forumUrl(locale), icon: ChatBubbleIcon, external: true }
      ]
    },
    {
      id: "more",
      items: [
        { id: "achievements", href: routes.achievements(), icon: MedalIcon },
        { id: "settings", href: routes.settings(), icon: SettingsIcon },
        { id: "help", href: routes.articles(), icon: HelpIcon }
      ]
    }
  ];

  const renderItem = (item: NavItem) => (
    <NavigationItem
      key={item.id}
      id={item.id}
      label={t(`nav.${item.id}`)}
      isActive={activeItem === item.id}
      href={item.href}
      external={item.external}
      icon={item.icon}
      showPremiumPill={item.showPremiumPill}
      isUserPremium={Boolean(isPremium)}
    />
  );

  return (
    <aside className="ui-lhs-menu" id="sidebar" data-testid="sidebar">
      <nav>
        {navigationGroups.map((group) => (
          <div className="nav-section" key={group.id}>
            <div className="nav-label">{t(`groups.${group.id}`)}</div>
            <ul className="nav-list">
              {group.items.map(renderItem)}
              {group.id === "more" && (
                <>
                  {!isPremium && (
                    <NavigationItem
                      id="upgrade"
                      label={t("nav.upgrade")}
                      isActive={false}
                      icon={PremiumStarIcon}
                      onClick={() => showPremiumUpgradeModal("upgrade_cta_nav")}
                    />
                  )}
                  <NavigationItem
                    id="logOut"
                    label={t("nav.logOut")}
                    isActive={false}
                    icon={WavingHandIcon}
                    onClick={handleLogout}
                  />
                </>
              )}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
