"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { NavigationItem } from "./NavigationItem";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface SidebarProps {
  activeItem?: string;
}

const navigationItems: Array<{ id: string; label: string; href?: string }> = [
  { id: "exercises", label: "Exercises", href: "/dashboard" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "articles", label: "Articles", href: "/articles" },
  { id: "concepts", label: "Concepts", href: "/concepts" },
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
    <aside className="w-1/4 bg-bg-primary border-r border-border-primary h-screen sticky top-0 flex flex-col theme-transition">
      <div className="p-6 border-b border-border-primary">
        <h1 className="text-2xl font-bold text-text-primary">Jiki Learn</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              id={item.id}
              label={item.label}
              isActive={activeItem === item.id}
              href={item.href}
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
