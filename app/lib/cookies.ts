/**
 * Read one cookie's value out of a raw `Cookie` request header.
 *
 * The edge entry point (worker-wrapper) holds a plain `Request`, which has no
 * cookie API — that only exists on `NextRequest`, further down the stack. A
 * substring check on the header is enough to test *presence* of a distinctively
 * named cookie, but not to read a value: it would match a name that is a suffix
 * of another cookie's name, and it says nothing about where the value ends.
 *
 * Returns null when the cookie is absent or has an empty value.
 */
export function readCookie(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const pair of cookieHeader.split(";")) {
    const separator = pair.indexOf("=");
    if (separator === -1) {
      continue;
    }
    if (pair.slice(0, separator).trim() !== name) {
      continue;
    }
    const value = pair.slice(separator + 1).trim();
    return value === "" ? null : decodeURIComponent(value);
  }

  return null;
}
