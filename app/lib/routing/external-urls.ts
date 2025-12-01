/**
 * Determines if a URL path should be accessible without authentication
 * These routes will be served from the (external) route group when unauthenticated
 */
export function isExternalUrl(pathname: string): boolean {
  // Landing Page & Dashboard should be synonmous
  if (pathname === "/") {
    return true;
  }

  // Unsubscribe page
  if (pathname.startsWith("/unsubscribe/")) {
    return true;
  }

  // Blog routes (current and localized)
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    return true;
  }

  // Localized blog routes (e.g., /de/blog, /es/blog/...)
  if (pathname.match(/^\/[a-z]{2}\/blog(\/|$)/)) {
    return true;
  }

  // Articles routes (current and localized)
  if (pathname === "/articles" || pathname.startsWith("/articles/")) {
    return true;
  }

  // Localized articles routes (e.g., /de/articles, /es/articles/...)
  if (pathname.match(/^\/[a-z]{2}\/articles(\/|$)/)) {
    return true;
  }

  // Concepts routes
  if (pathname === "/concepts" || pathname.startsWith("/concepts/")) {
    return true;
  }

  return false;
}
