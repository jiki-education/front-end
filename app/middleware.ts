import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTHENTICATION_COOKIE_NAME } from "./lib/auth/cookie-config";
import { PATHNAME_HEADER, URL_LOCALE_HEADER, isSupportedLocale } from "./lib/i18n/config";
import { resolveLocaleRouting } from "./lib/i18n/localeRouting";
import { isCacheableRoute } from "./lib/cache/cacheable-routes";
import { setInternalNavigationCookie } from "./lib/middleware/internal-navigation";

function setCSP(response: NextResponse): void {
  const isProduction = process.env.NODE_ENV === "production";

  // Set Content Security Policy headers
  // Allow unsafe-inline for Next.js inline scripts (required for RSC flight data)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://*.jiki.io https://*.stripe.com https://accounts.google.com https://www.gstatic.com https://www.youtube.com https://www.youtube-nocookie.com https://www.ytimg.com https://s.ytimg.com https://challenges.cloudflare.com https://static.cloudflareinsights.com ${isProduction ? "" : "'unsafe-eval' http://www.youtube.com http://www.ytimg.com http://s.ytimg.com"};
    style-src 'self' 'unsafe-inline' https://accounts.google.com;
    img-src 'self' blob: data: https://*.stripe.com https://*.mux.com https://*.litix.io https://*.jiki.io https://assets.exercism.org ${isProduction ? "" : "http://localhost:* http://local.jiki.io:*"};
    font-src 'self';
    media-src 'self' blob: https://*.mux.com;
    connect-src 'self' https://*.jiki.io https://*.stripe.com https://accounts.google.com https://*.mux.com https://*.litix.io https://storage.googleapis.com https://*.sentry.io https://cloudflareinsights.com ${isProduction ? "" : "http://localhost:* https://localhost:* http://local.jiki.io:* https://local.jiki.io:* ws://localhost:* ws://127.0.0.1:*"};
    frame-src 'self' https://*.stripe.com https://accounts.google.com https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isProduction ? "upgrade-insecure-requests;" : ""}
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Block direct access to external routes
  // if (path.startsWith("/external")) {
  //   return new NextResponse("Not Found", { status: 404 });
  // }

  //
  // Block access to /dev and test routes in production
  //
  const isTestRoute = path === "/dev" || path.startsWith("/dev/") || path === "/test" || path.startsWith("/test/");
  const isDevelopment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "development";
  if (isTestRoute && !isDevelopment) {
    return new NextResponse(null, { status: 404 });
  }

  //
  // Locale routing for pages that live in a single [locale] tree (blog, articles):
  // - an explicit default-locale prefix (/en/blog) redirects to its naked canonical
  //   URL (/blog), so there's one canonical address per page.
  // - a naked path (/blog) is rewritten to the default-locale branch (/en/blog)
  //   internally, keeping the visible URL naked while a single tree serves both.
  // Non-default locales (/hu/blog) pass straight through to [locale].
  //
  const routing = resolveLocaleRouting(path);
  if (routing.action === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = routing.target;
    return NextResponse.redirect(redirectUrl, 308);
  }

  //
  // Expose the URL locale segment (e.g. /hu/blog -> "hu") as a trusted request
  // header so resolveLocale() can make explicit-URL locale win. We always set or
  // delete it from the (trusted) path, so a client-supplied header can't spoof it.
  //
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PATHNAME_HEADER, path);
  // First path segment, kept whole including any region subtag (e.g. "pt-BR").
  const localeSegment = path.split("/")[1];
  if (isSupportedLocale(localeSegment)) {
    requestHeaders.set(URL_LOCALE_HEADER, localeSegment);
  } else {
    requestHeaders.delete(URL_LOCALE_HEADER);
  }

  //
  // Happy path! Rewrite naked localizable paths to the default-locale branch
  // (URL stays naked); everything else is served as-is.
  //
  let response: NextResponse;
  if (routing.action === "rewrite") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = routing.target;
    response = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }
  setCSP(response);
  setInternalNavigationCookie(request, response);

  //
  // Set cache headers for unauthenticated external URL requests
  // Skip for RSC requests (client-side navigation)
  //
  const isAuthenticated = request.cookies.has(AUTHENTICATION_COOKIE_NAME);
  const isRscRequest = request.headers.has("rsc");
  if (!isAuthenticated && !isRscRequest && isCacheableRoute(path)) {
    response.headers.set("Cache-Control", "public, max-age=600, s-maxage=600");
    response.headers.set("Vary", "Cookie");
  }

  // Cache favicon for 10 minutes
  if (path === "/favicon.ico") {
    response.headers.set("Cache-Control", "public, max-age=600");
  }

  return response;
}

export const config = {
  // Apply middleware to all routes
  matcher: ["/((?!_next/static|_next/image).*)"]
};
