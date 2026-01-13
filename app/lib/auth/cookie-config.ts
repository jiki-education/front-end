// Cookie names for authentication tokens
export const ACCESS_TOKEN_COOKIE_NAME = "jiki_access_token";
export const REFRESH_TOKEN_COOKIE_NAME = "jiki_refresh_token";

// Cookie options for authentication tokens
// Note: The cookie maxAge is long (1 year / 5 years), but the actual JWT inside
// only lives for a few minutes. This allows us to check for the presence of the
// cookie to see if the user SHOULD be logged in, but we still have the security
// of the short-lived JWT inside it.
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Note: Using 'strict' for better security. If OAuth redirects fail (cookies not sent
  // during cross-site navigation), switch back to 'lax'
  sameSite: "strict" as const,
  domain: process.env.NODE_ENV === "production" ? ".jiki.io" : ".local.jiki.io",
  path: "/"
};

export const ACCESS_TOKEN_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds
export const REFRESH_TOKEN_MAX_AGE = 5 * 365 * 24 * 60 * 60; // 5 years in seconds
