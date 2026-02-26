/**
 * API Configuration
 * Centralized configuration for backend API connection
 */

export const API_CONFIG = {
  development: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3060",
    chatUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || "http://local.jiki.io:3063"
  },
  production: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.jiki.io",
    chatUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || "https://chat.jiki.io"
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

export function getChatApiUrl(path: string): string {
  const config = getApiConfig();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${config.chatUrl}${cleanPath}`;
}

/**
 * Resolves an asset URL from the API. If the URL is relative (starts with "/"),
 * it is prefixed with the API base URL so that assets like uploaded avatars
 * resolve correctly rather than against the Next.js origin.
 */
export function resolveApiAssetUrl(url: string): string {
  if (url.startsWith("/")) {
    return `${getApiConfig().baseUrl}${url}`;
  }
  return url;
}
