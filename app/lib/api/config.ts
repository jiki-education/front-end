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

export function getApiConfig() {
  const isDevelopment = process.env.NODE_ENV === "development";
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
}

export function getApiUrl(path: string): string {
  const config = getApiConfig();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${config.baseUrl}${cleanPath}`;
}
