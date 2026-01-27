"use client";

import FolderIcon from "@static/icons/folder.svg";
import HouseIcon from "@static/icons/house.svg";
import MedalIcon from "@static/icons/medal.svg";
import ProjectsIcon from "@static/icons/projects.svg";
import SettingsIcon from "@static/icons/settings.svg";
import type { ComponentType } from "react";
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
}> = [
  { id: "learn", label: "Learn", href: "/dashboard", icon: HouseIcon },
  { id: "projects", label: "Projects", href: "/projects", icon: ProjectsIcon },
  { id: "concepts", label: "Concepts", href: "/concepts", icon: FolderIcon },
  { id: "achievements", label: "Achievements", href: "/achievements", icon: MedalIcon },
  { id: "settings", label: "Settings", href: "/settings", icon: SettingsIcon }
];

export default function Sidebar({ activeItem = "blog" }: SidebarProps) {
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
            />
          ))}
          <MoreMenu isActive={activeItem === "more"} />
        </ul>
      </nav>

      <a href="#" className="premium-upgrade-btn ">
        <span className="icon">⭐</span>
        <span>Upgrade to Premium</span>
      </a>
    </aside>
  );
}
