// Cookie name for authenticated users (set by Rails on login)
// This cookie is only present for logged-in users, not a generic session cookie
// Suffixed with the environment to avoid collisions between envs sharing a domain.
export const AUTHENTICATION_COOKIE_NAME = `jiki_user_id_${process.env.NODE_ENV}`;
