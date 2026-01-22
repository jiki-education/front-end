// Session cookie name (set by Rails)
export const SESSION_COOKIE_NAME = "jiki_session";

// Cookie domain for clearing cookies
export const COOKIE_DOMAIN = process.env.NODE_ENV === "production" ? ".jiki.io" : ".local.jiki.io";
