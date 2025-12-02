"use client";

import { useAuthStore } from "../../lib/auth/authStore";
import Footer from "./footer";
import ExternalHeader from "./header/external";
import Sidebar from "./sidebar/Sidebar";

interface SidebarLayoutProps {
  activeItem: string;
  children: React.ReactNode;
}

export default function SidebarLayout({ activeItem, children }: SidebarLayoutProps) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex bg-white">
        <Sidebar activeItem={activeItem} />
        <main className="flex-1 mt-[70px]">{children}</main>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ExternalHeader />
      <main className="flex-1 mt-[70px]">{children}</main>
      <Footer />
    </div>
  );
}
