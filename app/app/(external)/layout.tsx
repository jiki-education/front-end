"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header/internal";
import { useAuth } from "@/lib/auth/hooks";
import { usePathname } from "next/navigation";

export default function ExternalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();
  const isAuthPage = pathname.startsWith("/auth");
  const isConceptsPage = pathname.startsWith("/concepts");

  // Auth pages: no wrapper at all
  if (isAuthPage) {
    return children;
  }

  // Concepts pages with authenticated user: no header/footer
  if (isReady && isAuthenticated && isConceptsPage) {
    return children;
  }

  // All other pages: show header and footer
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-[70px]">{children}</main>
      <Footer />
    </div>
  );
}
