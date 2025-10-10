"use client";

import { AuthHeader } from "@/components/layout/AuthHeader";
import { usePathname } from "next/navigation";

export function ConditionalAuthHeader() {
  const pathname = usePathname();

  // Show AuthHeader only for content pages (blog/articles)
  const shouldShowHeader = pathname.includes("/blog") || pathname.includes("/articles");

  if (!shouldShowHeader) {
    return null;
  }

  // Determine the title based on the current route
  const getTitle = () => {
    if (pathname.includes("/blog")) {
      return "Blog";
    }
    if (pathname.includes("/articles")) {
      return "Articles";
    }
    return undefined;
  };

  return <AuthHeader title={getTitle()} />;
}
