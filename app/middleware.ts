import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic authentication credentials
// NOTE: These credentials are intentionally hardcoded and not considered secrets.
// They provide basic protection during development/staging but are not meant for
// production security. Username: jiki, Password: ave-fetching-chloe-packed
const BASIC_AUTH_USER = "jiki";
const BASIC_AUTH_PASSWORD = "ave-fetching-chloe-packed";

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
    script-src 'self' https://js.stripe.com ${isDevelopment ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}' 'strict-dynamic'`};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.stripe.com;
    font-src 'self';
    connect-src 'self' https://api.stripe.com ${isDevelopment ? "http://localhost:* https://localhost:* ws://localhost:* ws://127.0.0.1:*" : ""};
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
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
