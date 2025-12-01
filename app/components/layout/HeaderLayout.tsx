"use client";

import { useAuthStore } from "../../lib/auth/authStore";
import Footer from "./footer";
import InternalHeader from "./header/internal";
import ExternalHeader from "./header/external";

interface AuthenticatedHeaderLayoutProps {
  children: React.ReactNode;
}

export default function HeaderLayout({ children }: AuthenticatedHeaderLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-[70px]">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <InternalHeader /> : <ExternalHeader />;
}
