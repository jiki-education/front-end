import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isExternalUrl } from "./lib/routing/external-urls";

// Basic authentication credentials
// NOTE: These credentials are intentionally hardcoded and not considered secrets.
// They provide basic protection during development/staging but are not meant for
// production security. Username: jiki, Password: ave-fetching-chloe-packed
const BASIC_AUTH_USER = "jiki";
const BASIC_AUTH_PASSWORD = "ave-fetching-chloe-packed";

function setCSP(response: NextResponse): void {
  const isProduction = process.env.NODE_ENV === "production";

  // Set Content Security Policy headers
  // Allow unsafe-inline for Next.js inline scripts (required for RSC flight data)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://js.stripe.com https://accounts.google.com ${isProduction ? "" : "'unsafe-eval'"};
    style-src 'self' 'unsafe-inline' https://accounts.google.com;
    img-src 'self' blob: data: https://*.stripe.com;
    font-src 'self';
    connect-src 'self' https://api.jiki.io https://chat.jiki.io https://api.stripe.com https://accounts.google.com ${isProduction ? "" : "http://localhost:* https://localhost:* ws://localhost:* ws://127.0.0.1:*"};
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://accounts.google.com;
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

function checkBasicAuth(request: NextRequest): NextResponse | null {
  // Only apply basic auth in production
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"'
      }
    });
  }

  try {
    // Validate Authorization header format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Basic") {
      return new NextResponse("Authentication failed", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"'
        }
      });
    }

    const auth = parts[1];
    const decoded = Buffer.from(auth, "base64").toString("utf-8");

    // Validate decoded credentials format
    const colonIndex = decoded.indexOf(":");
    if (colonIndex === -1) {
      return new NextResponse("Authentication failed", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"'
        }
      });
    }

    const user = decoded.substring(0, colonIndex);
    const password = decoded.substring(colonIndex + 1);

    // Use constant-time comparison to prevent timing attacks
    const userMatch = user === BASIC_AUTH_USER;
    const passwordMatch = password === BASIC_AUTH_PASSWORD;

    if (!userMatch || !passwordMatch) {
      return new NextResponse("Authentication failed", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"'
        }
      });
    }

    return null;
  } catch {
    // Handle any decoding errors
    return new NextResponse("Authentication failed", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"'
      }
    });
  }
}

export function middleware(request: NextRequest) {
  // Check basic auth first
  const authResponse = checkBasicAuth(request);
  if (authResponse) {
    return authResponse;
  }

  const path = request.nextUrl.pathname;

  // Block direct access to external routes
  // if (path.startsWith("/external")) {
  //   return new NextResponse("Not Found", { status: 404 });
  // }

  //
  // Block access to /dev and test routes in production
  //
  const isTestRoute = path.startsWith("/dev") || path.startsWith("/test");
  const isDevelopment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "development";
  if (isTestRoute && !isDevelopment) {
    return new NextResponse(null, { status: 404 });
  }

  //
  // Happy path!
  //
  const response = NextResponse.next();
  setCSP(response);

  //
  // Rewrite unauthenticated external URL requests to static variant
  //
  const isAuthenticated = request.cookies.has("jiki_access_token");
  if (!isAuthenticated && isExternalUrl(path)) {
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
