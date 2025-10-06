/**
 * API Configuration
 * Centralized configuration for backend API connection
 */

export const API_CONFIG = {
  development: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3061"
  },
  production: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.jiki.com"
  }
} as const;

export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

export function getApiConfig() {
  const isDevelopment = process.env.NODE_ENV === "development";
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
}

export function getApiUrl(path: string): string {
  const config = getApiConfig();
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Add API version prefix if not already present
  if (!cleanPath.startsWith(`/${API_VERSION}`)) {
    cleanPath = `/${API_VERSION}${cleanPath}`;
  }

  return `${config.baseUrl}${cleanPath}`;
}
