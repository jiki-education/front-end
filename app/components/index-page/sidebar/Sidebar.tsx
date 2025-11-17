"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { NavigationItem } from "./NavigationItem";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "./Logo";
import type { ComponentType } from "react";
import HouseIcon from "../../../public/icons/house.svg";
import ProjectsIcon from "../../../public/icons/projects.svg";

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
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "articles", label: "Articles", href: "/articles" },
  { id: "concepts", label: "Concepts", href: "/concepts" },
  { id: "achievements", label: "Achievements", href: "/concepts" },
  { id: "settings", label: "Settings", href: "/settings" }
];

export default function Sidebar({ activeItem = "blog" }: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="ui-lhs-menu" id="sidebar">
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

      <div className="p-4 border-t border-border-primary space-y-3">
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
