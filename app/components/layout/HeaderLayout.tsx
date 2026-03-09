"use client";

import { useAuthStore } from "../../lib/auth/authStore";
import { ExternalFooter } from "./ExternalFooter";
import InternalHeader from "./header/internal";
import ExternalHeader from "./header/external";

interface AuthenticatedHeaderLayoutProps {
  children: React.ReactNode;
}

export default function HeaderLayout({ children }: AuthenticatedHeaderLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-[var(--header-height)]">{children}</main>
      <ExternalFooter />
    </div>
  );
}

function Header() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <InternalHeader /> : <ExternalHeader />;
}
