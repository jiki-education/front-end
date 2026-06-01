// Cookie name for authenticated users (set by Rails on login)
// This cookie is only present for logged-in users, not a generic session cookie
// Suffixed with the environment to avoid collisions between envs sharing a domain.
// All non-production envs (development, test) resolve to "development" so the
// Playwright test process and the dev server it runs against agree on the name.
const env = process.env.NODE_ENV === "production" ? "production" : "development";
export const AUTHENTICATION_COOKIE_NAME = `jiki_user_id_${env}`;
