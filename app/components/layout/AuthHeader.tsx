"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuthHeaderProps {
  title?: string;
}

export function AuthHeader({ title }: AuthHeaderProps) {
  const t = useTranslations("layout.authHeader");
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Hydration protection - prevents mismatch between server/client render of auth state
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-bg-primary border-b border-border-primary sticky top-0 z-resizer p-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-text-primary hover:text-link-primary">
              {t("brand")}
            </Link>
            {title && (
              <>
                <span className="mx-3 text-text-tertiary">/</span>
                <span className="text-text-secondary">{title}</span>
              </>
            )}
          </div>

          {/* Auth Section */}
          <nav className="flex items-center space-x-4">
            <Link href="/blog" className="text-text-secondary hover:text-text-primary transition-colors">
              {t("blog")}
            </Link>
            <Link href="/articles" className="text-text-secondary hover:text-text-primary transition-colors">
              {t("articles")}
            </Link>
            {/* Auth-dependent content with hydration protection */}
            {!mounted || isLoading ? (
              // Loading skeleton to prevent layout shift
              <div className="flex items-center space-x-2">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : isAuthenticated && user ? (
              // Authenticated user
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{t("welcome", { name: user.name || user.email })}</span>
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  {t("dashboard")}
                </Link>
                <Link
                  href="/settings"
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t("settings")}
                </Link>
              </div>
            ) : (
              // Anonymous user
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  {t("signUp")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
