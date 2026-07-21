"use client";

import LoadingJiki from "@/components/ui/LoadingJiki";
import { assetsUrl } from "@/lib/assets";
import { useAuthStore } from "@/lib/auth/authStore";
import { createCatalogLoader } from "@/lib/i18n/catalogLoader";
import { DEFAULT_TIME_ZONE, normalizeLocale, type Locale } from "@/lib/i18n/config";
import { setLocaleCookie } from "@/lib/i18n/localeCookie";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";

interface ClientLocaleProviderProps {
  /** Locale resolved server-side (URL segment for anon, NEXT_LOCALE cookie for gated). */
  initialLocale: string;
  /** Message catalog for `initialLocale`, loaded server-side via getMessages(). */
  initialMessages: AbstractIntlMessages;
  children: ReactNode;
}

/**
 * Owns the active UI locale on the client.
 *
 * The provider renders `initialLocale`/`initialMessages` (the server-resolved
 * seed) for the first paint, so external/anon SSR is unaffected. Once the auth
 * check populates `user.locale` (the authoritative preference from /internal/me),
 * if it differs from the seed we load that catalog client-side and swap.
 *
 * While a swap is in flight the provider renders `LoadingJiki` in place of its
 * children, so the app never paints in the wrong locale. "Swap pending" is
 * derived synchronously from render state (`authoritative !== locale`), which
 * avoids any cross-render flash. A catalog that fails to load is recorded in
 * `abandoned` so the swap settles instead of spinning forever (degrades to the
 * already-loaded locale).
 *
 * For anon users `user` is null, so `authoritative === initialLocale` and no
 * swap ever occurs.
 */
export function ClientLocaleProvider({ initialLocale, initialMessages, children }: ClientLocaleProviderProps) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);
  const [abandoned, setAbandoned] = useState<string | null>(null);
  const userLocale = useAuthStore((state) => state.user?.locale);

  // For anon/logged-out users `user` is null, so `userLocale` is null and
  // `authoritative` collapses to `normalizeLocale(initialLocale)`, which equals
  // `initialLocale` (already a normalized Locale) and therefore equals `locale`
  // on first render. So `needsSwap` is false and children render immediately —
  // no gate, no async load. The swap path is reachable only for a logged-in user
  // whose /me locale differs from the seed.
  const authoritative = normalizeLocale(userLocale ?? initialLocale);
  const needsSwap = authoritative !== locale && authoritative !== abandoned;

  useEffect(() => {
    if (!needsSwap) {
      return;
    }
    return loadLocaleCatalog(authoritative, {
      onLoaded: (loaded) => {
        setMessages(loaded);
        setLocale(authoritative);
        setLocaleCookie(authoritative);
        if (typeof document !== "undefined") {
          document.documentElement.lang = authoritative;
        }
      },
      // Give up on this locale rather than gate forever; keep current messages.
      onFailed: () => setAbandoned(authoritative)
    });
  }, [needsSwap, authoritative]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={DEFAULT_TIME_ZONE}>
      {needsSwap ? <LoadingJiki /> : children}
    </NextIntlClientProvider>
  );
}

// Fetches a locale's message catalog from R2 (the content-hashed cache tree) and
// reports the outcome. Returns a cleanup that cancels the pending swap (so an
// unmount / superseding locale change doesn't apply a stale catalog).
function loadLocaleCatalog(
  locale: Locale,
  { onLoaded, onFailed }: { onLoaded: (messages: AbstractIntlMessages) => void; onFailed: () => void }
): () => void {
  let cancelled = false;
  void fetchCatalog(locale)
    .then((messages) => {
      if (!cancelled) {
        onLoaded(messages);
      }
    })
    .catch(() => {
      if (!cancelled) {
        onFailed();
      }
    });
  return () => {
    cancelled = true;
  };
}

// R2-fetched catalog loader (see lib/i18n/catalogLoader.ts), shared across swaps
// so a re-entered locale reuses one request: promise cache keyed
// `${locale}:${hash}` (the hash is immutable per build, so a resolved entry stays
// valid), one retry on failure, and eviction of a rejected fetch so a later swap
// attempt retries. Mirrors `lib/i18n/request.ts` — there is NO bundled fallback.
const loadCatalog = createCatalogLoader(assetsUrl);

function fetchCatalog(locale: Locale): Promise<AbstractIntlMessages> {
  return loadCatalog(locale) as Promise<AbstractIntlMessages>;
}
