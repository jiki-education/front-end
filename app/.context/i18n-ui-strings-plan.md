# Plan: Internationalize all FE UI strings

Status as of this round: **infrastructure built + one pilot migrated.** What remains is the
mechanical sweep of ~700–1,000 hardcoded UI strings into the message catalog. This document is
the runbook for that sweep — written so it can be executed area-by-area, including by a
lower-effort model, without re-deciding architecture.

> Open decision (does NOT block the sweep): whether next-intl's URL routing replaces the existing
> blog/articles `[locale]` setup or coexists. To be resolved with a colleague. Until then we run
> next-intl in **"without i18n routing"** mode (locale from cookie/Rails preference, see below).

---

## 1. What already exists (the locked pattern)

Built this round — do not change without reason:

| Piece                  | File                                                                                   | Purpose                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Library                | `next-intl@4` (in `package.json`)                                                      | App Router i18n                                                                  |
| Plugin                 | `next.config.ts` → `createNextIntlPlugin("./lib/i18n/request.ts")`                     | wires request config                                                             |
| Request config         | `lib/i18n/request.ts`                                                                  | loads `messages/{locale}.json` per request                                       |
| Locale resolution      | `lib/i18n/resolveLocale.ts`                                                            | reads `NEXT_LOCALE` cookie → falls back to `DEFAULT_LOCALE`                      |
| Config/helpers         | `lib/i18n/config.ts`                                                                   | re-exports locales, `LOCALE_COOKIE_NAME`, `isSupportedLocale`, `normalizeLocale` |
| Cookie writer          | `lib/i18n/localeCookie.ts`                                                             | `setLocaleCookie()` — mirrors chosen locale into cookie for SSR                  |
| Provider               | `app/layout.tsx` → `NextIntlClientProvider` + `<html lang={locale}>`                   | messages to client components, dynamic lang                                      |
| Catalog                | `messages/en.json`, `messages/hu.json`                                                 | message dictionaries (`hu` starts as a copy of `en`)                             |
| Key typing             | `global.d.ts` (augments `next-intl` `AppConfig.Messages`)                              | compile-time autocomplete + validation of keys                                   |
| Locale source of truth | Rails (`settingsApi.updateLocale`), mirrored to cookie in `settingsStore.updateLocale` |                                                                                  |

**Pilot reference (copy this style):** `components/layout/ExternalFooter.tsx` — a server component
migrated to `getTranslations("layout.footer")`. Look at it before doing any area.

---

## 2. How to migrate a string (the recipe)

### Default to `useTranslations` (works in BOTH server and client components)

```tsx
import { useTranslations } from "next-intl";

export function Thing() {
  const t = useTranslations("namespace.subnamespace");
  return <button>{t("submit")}</button>;
}
```

`useTranslations` is the safe default. It works in server components AND client components.

> **Lesson from the pilot (IMPORTANT):** `getTranslations` from `next-intl/server` throws
> "`getTranslations` is not supported in Client Components" if the component ends up rendered in a
> client tree. A component without `"use client"` is NOT necessarily a server component — if any
> ancestor that imports it is `"use client"` (as `HeaderLayout`/`SidebarLayout` are), it runs
> client-side. `ExternalFooter` hit exactly this. **So: prefer `useTranslations` everywhere.**
> Only reach for `getTranslations` (async) when you are in a genuine server-only context such as
> `generateMetadata` or a page/layout you know is never pulled into a client tree.

### `getTranslations` — server-only contexts (e.g. `generateMetadata`)

```tsx
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("seo.somePage");
  return { title: t("title"), description: t("description") };
}
```

### Plain `.ts` logic files (toasts, errors) — NOT in a component

These have no hook/await context. Two options:

- **Preferred:** pass the translated string in from the calling component (translate at the call
  site with `t(...)`, pass the result down).
- **When that's impractical** (deep in a store/handler): use the non-hook getter
  `getTranslations()` from `next-intl/server` is server-only; for client stores use
  `import { getTranslations } from "next-intl/server"` is NOT available. Instead read via the
  app-level `t` passed in, or defer these strings to a follow-up. **Flag these; don't force them.**
  (Toasts are ~39 calls — most are reachable from a component; do those, list the rest.)

### Interpolation

```jsonc
// en.json
"greeting": "Hello {name}"
```

```tsx
t("greeting", { name: user.name });
```

### Pluralization (ICU)

```jsonc
"messagesLeft": "{count, plural, =0 {No messages left} one {# message left} other {# messages left}}"
```

### Rich text (embedded markup — landing pages especially)

```tsx
t.rich("intro", {
  strong: (chunks) => <strong>{chunks}</strong>,
  highlight: (chunks) => <span className="rough-highlight">{chunks}</span>
});
```

```jsonc
"intro": "Learn to code <strong>the fun way</strong> with <highlight>Jiki</highlight>"
```

### Dates / numbers / currency

Use next-intl's `useFormatter()` / `getFormatter()` (`format.dateTime`, `format.number`) rather
than hardcoding — locale-aware. Money: pass currency through `format.number(value, {style:
"currency", currency})`.

---

## 3. Key-naming convention (MUST follow — keys are hard to change later)

Mirror the feature-folder structure. One namespace per feature area, dot-nested to mirror the
component tree. camelCase leaf keys.

```
layout.footer.about.heading
layout.header.upgrade
auth.login.emailPlaceholder
auth.signup.submit
settings.profile.nameLabel
modals.welcome.title
toasts.logout.success
premium.cta.heading
roadmap.<item>.title
landing.faqs.question1
```

Rules:

- **Namespace = feature folder** (`components/<area>/` → `<area>` namespace).
- Group by component/section within the area.
- Leaf keys describe the _role_ (`emailPlaceholder`, `submit`, `heading`), not the English text.
- Reuse shared/generic strings under a `common.*` namespace (`common.cancel`, `common.save`,
  `common.loading`) — check `common.*` before adding a duplicate.
- Keep `en.json` keys **sorted/grouped** the same way across areas for reviewability.

After adding keys to `en.json`, **copy the same keys into `hu.json`** with the English value
(translation comes later; the copy keeps both catalogs structurally identical and typechecking
happy). A follow-up script can automate en→hu key sync; for now do it by hand per area.

---

## 4. Scope

### In scope (the sweep)

Order by ROI (small/high-visibility first, hardest last):

1. **`components/layout/`** — header, sidebar, footer (footer ✅ done). Every-page chrome. ~MEDIUM.
2. **`lib/modal/modals/`** — ~20 global modals. Short strings, high visibility. ~MEDIUM-HIGH.
3. **Toasts** — ~39 `toast.*(...)` calls across `lib/`, `components/`. Do the component-reachable
   ones; list the rest (see §2 plain-`.ts` note). ~MEDIUM.
4. **`components/auth/` + `app/(external)/auth/`** — login, signup, reset/forgot/confirm, 2FA,
   unsubscribe. Dense, structured. ~HIGH.
5. **`components/settings/` + `lib/settings/`** — profile, subscription, payment, password, 2FA.
   Labels, status text, interpolated plan strings. ~HIGH.
6. **`components/premium/` (incl. `pricing.data.tsx`) + `components/roadmap/roadmap.data.ts`** —
   config-object arrays; trivial extraction. ~MEDIUM.
7. **`components/landing-page/`** — LARGEST + HARDEST. Rich prose fragmented across
   `<strong>`/`<span class="rough-highlight">`/`{" "}`/HTML entities. Use `t.rich`. Budget the
   most time here.
8. **SEO metadata** — ~31 route `page.tsx` files with `metadata`/`generateMetadata`. Translate
   `title`/`description` via `getTranslations` in `generateMetadata`. Separate surface.
9. **Misc small flows** — delete-account, unsubscribe, testimonials, video/build/lesson/project,
   choose-language, error pages, `components/ui*` default labels/aria-labels.

### Out of scope (do NOT touch / do NOT count)

- `app/dev/*` and `app/test/*` — dev/test scaffolding, blocked in prod by middleware.
- **Content/curriculum text** — exercise instructions, hints, solutions, concept prose, blog &
  article bodies. These come from sibling packages (`@jiki/curriculum`, `../content/`) via
  generated per-locale caches and already have their own localization path. Only the app _chrome_
  around them (e.g. "Hints", "Run code", breadcrumbs, "read more") is in scope.
- The existing blog/articles `[locale]` routing — leave until the routing decision lands.

---

## 5. Per-area workflow (repeat for each area in §4)

1. List the area's files: `rg -l . components/<area>`.
2. For each file, find hardcoded user-facing strings:
   - JSX text: `>Some Text<`
   - String props: `placeholder=`, `label=`, `title=`, `alt=`, `aria-label=`, `heading=`,
     `subtitle=`, `description=`
   - `.ts`: `toast.`, `new Error(`, string literals in returned/config objects
3. Add keys to `messages/en.json` under the area namespace (§3). Mirror into `messages/hu.json`.
4. Replace literals with `t("...")` / `t.rich(...)` per §2. Make server components `async` as needed.
5. Typecheck (key typing will catch typos): `cd app && npx tsc --noEmit`.
6. Lint touched files: `cd app && npx eslint <files>`.
7. Spot-check in the dev server (`./bin/dev-claude`, port 3071) that the area renders.
8. Commit per-area (only if the user has asked for commits — default is leave in working tree).

### Tests

`next-intl` is **globally mocked in `jest.setup.js`** — the mock reads `messages/en.json` and
returns the real English strings (supports namespaces, dotted keys, `{var}` interpolation, and
`t.rich`). So components using `useTranslations`/`t.rich` render their English text in tests with
**no per-test provider needed**, and existing assertions that match visible English keep passing.

Implications for the sweep:

- After migrating an area, existing tests asserting that area's English text **still pass** because
  the value in `en.json` is the same English string. If you change the wording while extracting,
  update the matching test assertion too.
- New components needing translations need no test setup — the global mock covers them.
- `next.config.test.ts` mocks `next-intl/plugin` (it can't load under jsdom); leave that mock in place.
- The jest `transformIgnorePatterns` in `jest.config.mjs` allowlists `next-intl`, `use-intl`,
  `intl-messageformat`, and `@formatjs/*` through Babel. If a future next-intl upgrade pulls in a
  new ESM transitive dep, add it there. Read `.context/testing.md` before writing tests.

### Guardrails

- **Never invent keys not in `en.json`** — add to `en.json` first, then reference. The
  `global.d.ts` augmentation makes `t("…")` autocomplete and fail typecheck on typos. Use it.
- Don't translate: code, URLs, class names, `data-*` values, test ids, console.\* debug logs,
  Sentry messages, analytics event names.
- Watch HTML entities: `&apos;` → `'`, `&mdash;` → `—`, `&copy;` → `©` inside JSON values.
- Preserve whitespace/punctuation exactly when moving a string.
- One area = one reviewable chunk. Don't mega-commit the whole sweep.

---

## 6. Verification (end of sweep)

- `cd app && npx tsc --noEmit` → clean.
- `cd app && pnpm run lint` → clean (read `.context/eslint.md` before adding any disable comment).
- `cd front-end && pnpm test:app` → green.
- Manual: load key pages on the dev server; flip `NEXT_LOCALE` cookie to `hu` and confirm the
  page still renders (it shows English until `hu` values are translated — expected).
- Update `.context/i18n.md` to document the UI-string system (currently only documents content
  localization).

---

## 7. Deferred / follow-up (NOT this sweep)

- **Routing decision** (colleague): next-intl URL routing app-wide vs. coexist with blog/articles
  `[locale]`. When decided, layer `next-intl/navigation` + middleware on top; the catalog work
  done here is unaffected.
- **Live locale switch re-render**: changing locale writes the cookie + Rails preference; a
  `router.refresh()` (or navigation) is needed to re-render in the new locale. Wire this into the
  settings locale selector once routing is decided.
- **`hu` translations**: actual Hungarian copy. Infra ships `en` behind the `?? en` fallback;
  translation is a separate content task.
- **en→hu key-sync script**: automate keeping `hu.json` structurally in sync with `en.json`.
- **Plain-`.ts` toast/error strings** not reachable from a component (see §2) — collect into a
  list and decide a pattern (pass-in vs. a small client-side message accessor).

```

```
