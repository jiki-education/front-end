import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Block access to /dev and test routes in production
  const path = request.nextUrl.pathname;
  const isTestRoute = path.startsWith("/dev") || path.startsWith("/test");

  if (isTestRoute) {
    // Only allow in development mode
    const isDevelopment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "development";

    if (!isDevelopment) {
      // Return 404 if not in development
      return new NextResponse(null, { status: 404 });
    }
  }

  // Generate nonce for inline scripts
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDevelopment = process.env.NODE_ENV === "development";

  // Set Content Security Policy headers
  // In development, allow unsafe-inline for Next.js dev scripts
  // In production, use strict nonce-based CSP
  const cspHeader = `
    default-src 'self';
    script-src 'self' https://js.stripe.com https://accounts.google.com ${isDevelopment ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}' 'strict-dynamic'`};
    style-src 'self' 'unsafe-inline' https://accounts.google.com;
    img-src 'self' blob: data: https://*.stripe.com;
    font-src 'self';
    connect-src 'self' https://api.stripe.com https://accounts.google.com ${isDevelopment ? "http://localhost:* https://localhost:* ws://localhost:* ws://127.0.0.1:*" : ""};
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://accounts.google.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDevelopment ? "" : "upgrade-insecure-requests;"}
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  // Apply middleware to all routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
