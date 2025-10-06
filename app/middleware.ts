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

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: ["/dev/:path*", "/test/:path*"]
};
