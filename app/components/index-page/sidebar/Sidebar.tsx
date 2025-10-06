"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { NavigationItem } from "./NavigationItem";

interface SidebarProps {
  activeItem?: string;
}

const navigationItems = [
  { id: "exercises", label: "Exercises" },
  { id: "concepts", label: "Concepts" },
  { id: "profile", label: "Profile" },
  { id: "achievements", label: "Achievements" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "settings", label: "Settings" }
];

export default function Sidebar({ activeItem = "exercises" }: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="w-1/4 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Jiki Learn</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem key={item.id} id={item.id} label={item.label} isActive={activeItem === item.id} />
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-3">
        {user && (
          <div className="text-sm">
            <div className="font-semibold text-gray-700">Signed in as:</div>
            <div className="truncate text-gray-500">{user.email}</div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>

        <div className="text-xs text-gray-400 text-center">Version 1.0.0</div>
      </div>
    </aside>
  );
}
