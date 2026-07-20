# i18n TODO (app + curriculum + interpreters)

Master plan for internationalizing **all** student-facing text across the monorepo. Living doc;
tick items as they land. The curriculum-side detail lives in `curriculum/.context/i18n.md`.

## The model (decided)

- **Each package owns and authors its own strings; consumers are dumb renderers.** The interpreter
  relays `logicError` verbatim; the app renders `errorHtml` as-is.
- **One convention everywhere:** i18next-style per-locale `translation.json`, `en` canonical.
- **No runtime fallback.** A missing key surfaces as the key (visible), never silent English.
  Completeness is the CI guard's job, not a fallback's. (`fallbackLng` off everywhere.)
- **Never bundle the locale set.** Only the active locale is ever loaded. This holds for app UI
  (next-intl already lazy-imports per locale), curriculum (per-exercise catalogs), and the
  interpreter (per-language catalogs) — because locales scale (50 languages ⇒ 50× every catalog).
- **Persistent fetches, ephemeral receives.** The app is the single persistent runtime: it fetches
  each locale's dict from R2 (once, cached) and **injects** it into the ephemeral consumers.
  Exercises get `exercise.setMessages(dict)`; the interpreter gets `interpret(code, { localeData })`.
- **Delivery follows volume.** Curriculum catalogs (unbounded, scale with corpus) → build-export to
  R2, fetched + injected. Interpreter catalogs (bounded, code-owned diagnostics) → still owned by the
  interpreter, but the resolved active-locale dict is passed in by the app the same way (so nothing
  bundles the whole set).
- **Packs are app-held singletons, passed by reference.** The persistent app caches each fetched pack
  once (`Map` keyed by `${slug}:${locale}` for exercises, `${language}:${locale}` for the interpreter)
  and passes the reference into `setMessages` / `interpret(localeData)`. Never re-fetch or copy a pack
  per run. Translators are stateless, so also memoize the translator per pack identity
  (`WeakMap<Messages, Translator>`) — one translator per (slug/lang, locale), shared across every
  exercise/interpreter instance (there are several constructions per run: primary + each isolated
  check + each scenario).

## Current state

- **Curriculum:** inject-the-dict model built. `createTranslator(dict)` + `Exercise.setMessages()`;
  `dnd-roll` logic-error strings resolve through it; `hu` fully translated. No global, no bundling,
  no fallback. Guard test for catalog parity in place.
- **Interpreter:** still statically bundles all locale packs + global `changeLanguage`. Unchanged.
- **App:** does **not** thread locale into the execution layer at all. `useExerciseLoader` hardcodes
  `"en"`; nothing calls `setMessages` or the interpreter's `changeLanguage`. **Symptom:** in dev with
  `hu`, `roll(7)` renders the raw key `errors.unknownDice` — the inject model working correctly with
  nothing injected. This is the top gap.

## TODO

### App — wire the locale into execution (the top blocker)

- [ ] `generate-exercise-cache.js`: read each exercise's `locales/{locale}/translation.json` and emit
      it as an `i18n` field on the per-locale content blob (alongside `instructions`/`stub`/`solution`).
      Never bundle; it rides the same R2 artifact.
- [ ] Fetch/loader (`exercise-meta.ts`, `useExerciseLoader`): stop hardcoding `"en"`; request the
      active locale; carry `i18n` onto the assembled `ExerciseDefinition`.
- [ ] Runner: at the single execution construction point (`runVisualScenario` `runPrimaryCheck`, plus
      the isolated-check re-run, and the IO runner) call `exercise.setMessages(definition.i18n)` right
      after `new ExerciseClass()`. The lint temp-instance does **not** need it (never runs code).
- [ ] Interpreter locale: pass the active-locale interpreter dict into `interpret(code, { localeData })`
      (see interpreter section) so its own syntax/runtime errors localize too.
- [ ] Per-exercise content fallback: `exercise-meta.ts` currently throws if a locale's index is
      missing — decide graceful handling vs. guaranteeing coverage via the guard.

### App — UI catalogs → R2-fetched (required before the ~50-locale expansion)

The app UI catalogs are the one surface still violating "never bundle the locale set":
`lib/i18n/request.ts` bundler-imports `messages/{locale}.json`, so every locale's catalog compiles
into the worker (only the active one is *evaluated*, but all ship — megabytes inside a 10MB-gzipped
worker at 50 locales). Move delivery onto the existing static-content pipeline (the
`fetchStaticContent` pattern blog/articles use). No component changes: `useTranslations`/`t.rich`
call sites, the `messages/*.json` source files, key typing (`global.d.ts` reads `en.json` at compile
time), and the jest mock are all untouched. Side benefit: translation updates stop requiring a
redeploy.

- [ ] `generate-messages-cache.js` (clone the `generate-*-cache.js` shape): emit
      `public/static/messages/{locale}-{hash}.json` + a manifest in `lib/generated/`, wired into
      `dev` and `build`; synced to R2 by the existing `static:upload`.
- [ ] `lib/i18n/request.ts`: fetch the manifest-addressed JSON at SSR with a module-scope cache
      keyed by the immutable hash (the real work — verify SSR latency on cold isolates; single
      fetch retry). **No bundled fallback catalog** (decided): a failed fetch fails the request,
      never silent English.
- [ ] `ClientLocaleProvider`: swap its `import()` for a fetch of the same URL (existing failed-load
      handling already covers it).
- [ ] Known cost it does NOT address: the active locale's whole catalog is serialized into each SSR
      response as `initialMessages` (scales with catalog size, not locale count). If heavy,
      next-intl supports per-page message subsets — separate decision.

### Interpreter — de-bundle + inject + no fallback

- [ ] Stop static-importing all locale packs in `src/*/translator.ts`; the interpreter still **owns**
      (authors) the catalogs and build-exports them per-locale, but the app passes the resolved
      active-locale dict in via `interpret(code, { localeData })`.
- [ ] Remove `fallbackLng` (no fallback).
- [ ] Decide what happens to the `system` structural bundle under no-fallback (keep as an always-passed
      structural base vs fold into `en`).
- [ ] LogicError contract unchanged — interpreter keeps relaying `{{message}}` verbatim.
- [ ] (See `~/.claude/plans/fizzy-munching-peacock.md` for the JS error/describer extraction.)

### Uncovered string surfaces (need mechanism, not in the exercise sweep)

Discovered during extraction — the dnd-roll pattern doesn't reach these; left as English, no fallback:
- **`codeChecks[].errorHtml`** — `CodeCheck.errorHtml` is a plain literal with no exercise instance
  (unlike scenario `expectations`), so `exercise.t()` can't reach it. **Fix:** `CodeCheck` returns
  `{ key, params }` resolved by the runner against the injected dict (a shared-type change in
  `src/exercises/types.ts`), then sweep them.
- **`availableFunctions[].description`** (e.g. `"moved the ball to position ${arg1}"`) — feeds the
  execution-frame log via `${arg1}`/`${return}` templating, a separate mechanism from `t()`. Even
  dnd-roll leaves these. **Fix:** integrate the frame-log describer with the injected dict, then sweep.

### API — locale-prefixed unsubscribe links in emails

The app's unsubscribe page lives in the `(hybrid)/[locale]` tree, so `/hu/unsubscribe?token=...`
already renders localized for anonymous visitors (URL segment wins in `resolveLocale`, no cookie
needed). But the api repo's email templates generate naked `/unsubscribe?token=...` links, which
resolve to the default locale. **Fix (api repo):** the mailer URL helpers prefix unsubscribe (and
any other email-deep-link) URLs with the recipient's locale. No front-end work needed. Do this
alongside extracting the notification-type strings from `app/lib/notifications/config.ts` into the
`unsubscribe.*` catalog namespace.

### IO exercises with runtime strings (DEFERRED — needs an IO runtime mechanism)

Most IO exercises use `expected:` value-comparison (the runner generates the diff), so they're
static-strings-only and follow the standard pattern. But these 8 have `errorHtml`/`logicError`
produced in a **static** function (IO exercises are never instantiated at runtime, so `exercise.t`
can't reach them): `even-or-odd`, `leap`, `lower-pangram`, `lunchbox`, `raindrops`, `two-fer`,
`llm-response`, `lookup-time`. **Fix:** give the IO runner a way to resolve — the IO scenario/function
returns `{ key, params }` and `runIOScenario` resolves it via a translator built from the fetched dict
(no instance needed). Then extract these 8. Do NOT add a fallback to bridge the gap.

### Curriculum — finish the extraction

- [ ] `errorHtml` in `scenarios.ts` (runtime feedback, resolves via the injected dict at failure time).
- [ ] Static strings — scenario `name`/`description`, `metadata.json` hints, `FunctionInfo`
      `description` prose — pre-resolved at build time into the per-locale content blob (app-side),
      not runtime keys. (`FunctionInfo` `examples`/`signature` stay literal JS.)
- [ ] Sweep all 103 exercises; author `en`, then seed `hu` stubs (never auto-translate).

### Build / delivery

- [ ] Extend `seed-language.js` to stub exercise `instructions` **and** the new catalogs (today it
      only covers concepts/blog/articles).
- [ ] Confirm curriculum catalogs are build inputs read from source (not bundled, not copied to
      `dist`) — done.

### CI validation (merge gate)

- [ ] One app-side, `REQUIRED_LOCALES`-driven validator (mirroring PR #885's content guard) that walks
      the app, curriculum, and interpreter catalogs and asserts: required-locale presence, key-tree
      parity with `en`, valid interpolation, no stray whitespace. Format-aware (ICU for app UI, i18next
      for curriculum + interpreters); exclude the interpreter `system` pseudo-locale.
- [ ] Two-level completeness: per-catalog gate now; corpus gate (every exercise + every interpreter
      language has every `REQUIRED_LOCALES` locale) after the seed pass.
- [ ] **Merge gate:** the i18n effort is not merged until this validation is green across all three
      packages.

## Unify the execution model — always instantiate (IN PROGRESS)

`VisualExercise` is instance-based (instantiated per run) but `IOExercise` is fully **static** (never
instantiated; runner calls static `getExternalFunctions`). That asymmetry blocks `this.t` for IO
strings and forces a split code path.

**Decision:** always instantiate, one path (`new ExerciseClass()` + `setMessages`), for both visual and
IO, for execution and lint. We considered the opposite lever — making `availableFunctions` **static
descriptors** on both so enumeration never needs an instance (`func: Class.prototype.method`, apply at
call) — and **rejected it** in favour of the simpler always-instantiate path. (Lazy `createView` is not
needed: IO exercises have no view, and visual already instantiates for lint, so nothing gets costlier.)

- [ ] Convert `IOExercise` + all ~41 IO subclasses from static to instance members.
- [ ] `runIOScenario` instantiates + `setMessages`; `Orchestrator` lint branch collapses to always `new`.
- [ ] Unblocks `this.t` for IO exercises (so `llm-response`/`lookup-time` logicError i18n becomes
      possible after this lands — see deferred list).

## Pilot shortcuts (KNOWINGLY WRONG — fix on proper rollout)

These are deliberate hacks to prove the wire on `dnd-roll` in dev. Do not ship them.

- **`i18n` is threaded as an optional inline intersection** (`ExerciseDefinition & { i18n?: Record<string,
  unknown> }`) with `?? {}` at use sites, to avoid editing the curriculum type during the pilot.
  **Fix:** add a **required** `i18n: Messages` field to `ExerciseDefinition` in
  `curriculum/src/exercises/types.ts`, always populate it at assembly (`{}` when the exercise has no
  catalog — an empty dict is a real value, not an absent field), and delete the intersection + `??`. No
  optional fields.
- **Message dict delivered as a separate `i18n-{locale}.json` artifact**, fetched independently of the
  instructions content locale. This was to unblock the pilot because no `hu` content blobs exist yet
  (no exercise has `hu.md`). **Revisit** whether messages ride the per-locale content blob vs. a
  separate artifact once content locales are stubbed.
- **Only `dnd-roll` is migrated**, and the app injection is wired just enough to render one exercise.
- **Content fetch switched to the UI locale with NO fallback.** In a non-`en` locale, only exercises
  that have that locale's content load; every un-migrated exercise **fails to load** (by design — no
  fallback). This partial state is acceptable only for the pilot. **MUST be gone from the final
  branch:** either every exercise is fully localized for each shipped locale, or that locale is not
  enabled. Do not merge a state where some exercises fail to load in a shipped locale.
- **No pack caching yet.** The pilot fetches the dict per load and rebuilds a translator on every
  `setMessages`. **Fix:** app-held singleton pack cache + `WeakMap<Messages, Translator>` memoization
  (see the "Packs are app-held singletons" model bullet).

## Status

**95 of 103 exercises fully localized** (English verbatim + `hu` stubs): `dnd-roll` (reference, `hu`
authored) + 94 swept via sonnet batches. Per-exercise catalogs; families share base-class `errors.*`
keys; single `{{var}}` messages; no fallbacks. Curriculum suite green (1069). App resolves via
`localizeExerciseDefinition` + `setMessages` (generic, done).

Outstanding before "done" (see Merge gate):

1. **8 IO-runtime exercises** (`even-or-odd`, `leap`, `lower-pangram`, `lunchbox`, `raindrops`,
   `two-fer`, `llm-response`, `lookup-time`) — need the IO `{key, params}` runner mechanism first; they
   currently fail to load in `hu` (no-fallback, by design).
2. **`codeChecks[].errorHtml`** and **`availableFunctions[].description` describer** surfaces — need
   their mechanisms, then sweep the keys already mirrored into catalogs.
3. **Pilot-shortcut cleanups** — required `i18n` field on `ExerciseDefinition`; pack singleton +
   translator memoization.
4. **App-side cross-package i18n validator + CI gate**; extend `seed-language.js` for the 8 IO `hu.md`.
5. **Interpreter** — separate track, brief at `interpreters/i18n_interpreter_brief.md`.

## Decisions log

- **Inject the dict, don't self-fetch.** App (persistent) fetches + caches; exercise/interpreter
  (ephemeral) receive it. Rationale: persistence boundary.
- **Setter over constructor injection** for `setMessages` — the exercise lifecycle is already
  construct-then-configure, and the static-functions refactor gives a single construction chokepoint
  that makes the setter safe. Constructor injection stays an option if we want type-enforcement.
- **Function descriptors: type-checked method reference**, not stringly `this[name]`, not per-arg
  wrapper arrows.
- **i18next, not ICU, for curriculum + interpreter** (curriculum's strings are execution-layer peers
  of the interpreter's; both hand finished strings to renderers). App UI stays next-intl/ICU.
