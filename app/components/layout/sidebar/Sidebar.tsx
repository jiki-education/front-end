"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NavigationItem } from "./NavigationItem";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "./Logo";
import type { ComponentType } from "react";
import HouseIcon from "@static/icons/house.svg";
import ProjectsIcon from "@static/icons/projects.svg";
import MedalIcon from "@static/icons/medal.svg";
import SettingsIcon from "@static/icons/settings.svg";
import FolderIcon from "@static/icons/folder.svg";

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
  { id: "achievements", label: "Achievements", href: "", icon: MedalIcon },
  { id: "settings", label: "Settings", href: "/settings", icon: SettingsIcon }
];

export default function Sidebar({ activeItem = "blog" }: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
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
            />
          ))}
        </ul>
      </nav>

      <a href="#" className="premium-upgrade-btn ">
        <span className="icon">⭐</span>
        <span>Upgrade to Premium</span>
      </a>

      <div className="p-4 border-t border-border-primary space-y-3 mt-auto">
        {user && (
          <div className="text-sm">
            <div className="font-semibold text-text-primary">Signed in as:</div>
            <div className="truncate text-text-secondary">{user.email}</div>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Theme</span>
          <ThemeToggle />
        </div>

        {/* Blog & Articles Links */}
        <div className="space-y-1">
          <Link
            href="/blog"
            className="block w-full px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover rounded-lg transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/articles"
            className="block w-full px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover rounded-lg transition-colors"
          >
            Articles
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-error-text hover:bg-error-bg rounded-lg transition-colors focus-ring"
        >
          Sign Out
        </button>

        <div className="text-xs text-text-muted text-center">Version 1.0.0</div>
      </div>
    </aside>
  );
}
