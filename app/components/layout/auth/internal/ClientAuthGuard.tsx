"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isExerciseLessonSlug } from "@jiki/curriculum/slugs";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useAuthStore } from "../../../../lib/auth/authStore";

/**
 * Client-side guard that redirects unauthenticated users from protected pages.
 *
 * Used in app/(app)/layout.tsx to protect authenticated routes. Waits for global
 * auth initialization to complete, then sends unauthenticated users to /auth/login
 * (or, for /dashboard, to the landing page — its public equivalent).
 *
 * (app) routes are always protected and never have a public twin at the same URL
 * (pages that serve both auth states live in the (hybrid) group and branch on the
 * cookie themselves), so there is no "reload to reveal the public version" case.
 *
 * Two routes have a public equivalent at a *different* URL and go there instead of
 * to the login page: /dashboard (the landing page) and an exercise lesson (its
 * public exercise page). Middleware already redirects exercise lessons on a
 * document request; this covers what it can't — a client-side navigation, whose
 * RSC request the locale layer deliberately leaves alone, and an auth cookie that
 * only turns out to be dead once the token refresh fails.
 */
const LESSON_PATH_PREFIX = "/lesson/";

export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const routes = useLocaleRoutes();

  // Handle unauthenticated redirect in useEffect (not during render)
  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      // /dashboard's public equivalent is the landing page, not a same-URL twin.
      if (pathname === "/dashboard") {
        router.push(routes.home());
        return;
      }
      // An exercise lesson's public equivalent is its exercise page.
      const exerciseSlug = publicExerciseSlugFor(pathname);
      if (exerciseSlug) {
        router.push(routes.exercise(exerciseSlug));
        return;
      }
      router.push(routes.authLogin());
    }
  }, [isAuthenticated, hasCheckedAuth, pathname, router, routes]);

  // Show nothing while auth is checking (loading spinner shown by ClientAuthInitializer above)
  // or while redirecting unauthenticated users
  if (!hasCheckedAuth || !isAuthenticated) {
    return null;
  }
  // Auth succeeded - render children
  return <>{children}</>;
}

/**
 * The exercise slug whose public page stands in for this lesson, or null when the
 * lesson has no public twin (video, quiz and choose-language lessons have none).
 *
 * (app) routes are never locale-prefixed, so the path is always a naked /lesson/<slug>.
 */
function publicExerciseSlugFor(pathname: string): string | null {
  const slug = pathname.startsWith(LESSON_PATH_PREFIX) ? pathname.slice(LESSON_PATH_PREFIX.length) : null;
  return slug !== null && isExerciseLessonSlug(slug) ? slug : null;
}
