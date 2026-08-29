/**
 * Whether this tab has already refreshed itself to recover from a rate limit,
 * and how recently.
 *
 * The rate-limit modal's job is to wait out a 429 and then reload. Doing that on
 * a loop is how a rate limit becomes permanent: the reload it performs to
 * recover is itself around a hundred requests, which spends the very budget it
 * was waiting for, so the next load is blocked too and the page refreshes
 * forever. One automatic attempt is a recovery. The second is the loop.
 *
 * "We already tried" cannot be inferred from the app recovering, because a page
 * that reloads always succeeds at something before it is blocked again. So it is
 * recorded explicitly, and it expires: a tab left open for hours gets its
 * automatic retry back once the incident is well behind it, while an incident in
 * progress never gets a second one.
 *
 * sessionStorage rather than localStorage, because the marker describes this
 * tab's current predicament and should not outlive it. Every access is guarded:
 * storage throws outright in some privacy modes, and a modal that cannot render
 * is worse than one that retries.
 */

const STORAGE_KEY = "jiki-rate-limit-auto-reloaded-at";

/** How long one automatic reload suppresses the next. */
export const AUTO_RELOAD_COOLDOWN_MS = 10 * 60 * 1000;

/** True when this tab auto-reloaded recently enough that the incident is likely the same one. */
export function hasRecentlyAutoReloaded(now: number = Date.now()): boolean {
  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode etc.). Treat it as a first attempt: one
    // reload too many is a smaller failure than never recovering at all.
    return false;
  }

  if (raw === null) {
    return false;
  }

  const at = Number.parseInt(raw, 10);
  if (Number.isNaN(at)) {
    return false;
  }

  // A clock that moved backwards (timezone change, NTP correction) would make a
  // past reload look like a future one. Count that as recent rather than letting
  // it hand out an unlimited supply of retries.
  return now - at < AUTO_RELOAD_COOLDOWN_MS;
}

/** Record that this tab is about to reload itself, so it does not do so again. */
export function recordAutoReload(now: number = Date.now()): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, String(now));
  } catch {
    // Nothing to do: without storage the next incident gets another automatic
    // reload, which is the behaviour this module exists to bound but not a
    // reason to fail here.
  }
}
