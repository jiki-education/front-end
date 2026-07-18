# Brief: localize the interpreter's own error messages (inject-the-dict model)

You are working in `@jiki/interpreters` (`front-end/interpreters`). Read this whole brief, then read
the references, before editing.

## Background: the monorepo i18n model (already decided)

The whole front-end is being internationalized. The agreed model, which this task must follow:

- **Each package owns and authors its own student-facing strings; consumers are dumb renderers.**
- **Convention:** i18next-style per-locale `translation.json`, `en` is canonical.
- **No runtime fallback.** A missing key surfaces as the key (visible), never silent English.
  Completeness is enforced by a CI guard, not by a fallback. So `fallbackLng` is OFF.
- **Never bundle the whole locale set.** Only the active locale is ever loaded at runtime. Locales
  scale (assume 50 languages soon → 50× every catalog), so static-importing all packs is a bug.
- **Persistent fetches, ephemeral receives.** The app is the single persistent runtime: it fetches
  the active locale's dict and **injects** it into ephemeral consumers per run. The interpreter is
  such a consumer.

The interpreter's place in this: it **owns/authors** its error catalog (the diagnostic strings are
part of the interpreter's behavior), and build-exports it per locale — but at runtime it must **not
bundle every locale**; the app passes in the resolved active-locale dict per run.

## Scope

**IN scope:** the interpreter's own student-facing diagnostics — syntax errors, runtime errors, type
errors, lint messages — currently under `error.*` in `src/{javascript,python,jikiscript}/locales/{en,
system,hu}/translation.json`, resolved via `translate()`.

**OUT of scope (do NOT touch):**

- **`LogicErrorInExecution` `{{message}}` passthrough.** The curriculum pre-translates `logicError`
  strings and passes the finished string in; the interpreter relays `{{message}}` verbatim and never
  keys/translates it. Leave exactly as-is. (See the LogicError pre-translated contract memory.)
- **`FunctionExecutionError` `{{message}}`** — wraps arbitrary native JS `Error.message`; inherently
  untranslatable. Leave; document as a known limit.
- **Python / JikiScript** unless you're explicitly asked — start JS-only (mirrors the existing plan).

## Current state (facts)

- Each language has `src/<lang>/translator.ts`: a **module-global** i18next `createInstance()` that
  **statically imports** `./locales/{en,hu,system}/translation.json`, with `fallbackLng: "en"`,
  `interpolation: { escapeValue: false }`, exposing `translate(key, options)`, `changeLanguage`,
  `getLanguage`.
- Locales present: **JS = en + hu + system; Python & JikiScript = en + system only** (no `hu`).
- `translate()` is called from the executor, parser, and scanner. Representative: `executor.ts`
  `public error(type, location, context)` at ~line 761 → `translate(\`error.runtime.${type}\`, context)`,
plus direct calls (e.g. `executor.ts`~341/465/474/483). **Trace every`translate()`call site**
(executor + parser + scanner + anywhere else) — they all currently resolve against the global
instance's active language, which the app never sets, so everything is`en` today.
- Entry points all take an `EvaluationContext`: `interpret(sourceCode, context)`,
  `evaluateFunction(sourceCode, context, …)`, `compile(sourceCode, context)`.
- The app pipes locale into the interpreter **nowhere** — `changeLanguage` is called nowhere in the app.

## The task

1. **Accept the active-locale dict per run.** Add a `localeData` field (the resolved single-locale
   message dict for this run; type it, e.g. `Record<string, unknown>` or a shared `Messages` type) to
   `EvaluationContext`, threaded through `interpret` / `evaluateFunction` / `compile`. The app will
   pass it in (that wiring is the app's job, not yours — but design the signature for it).

2. **Resolve against the injected dict, not a bundled global.**
   - Stop static-importing all locale packs. Build a **per-run** translator from `context.localeData`
     (mirror `curriculum/src/i18n/translator.ts`'s `createTranslator(dict)` — a fresh i18next instance
     fed only that dict, `escapeValue: false`).
   - Route every `translate()` call site through that per-run translator. Since it's currently a module
     global used widely, the clean move is to hang the translator off the executor (and pass it to the
     parser/scanner) so `executor.error(...)` and the syntax-error paths resolve against the per-run
     instance. Remove the global mutable `changeLanguage` singleton.
   - Result: no locale is bundled except what you keep as the structural base (see #4); the active
     locale arrives via `localeData`.

3. **No fallback.** Remove `fallbackLng`. A missing key must surface as the key.

   **Perf note:** the persistent app holds each interpreter pack as a singleton (one per
   `${language}:${locale}`) and passes the same `localeData` reference into every `interpret()` call —
   don't design an API that forces re-parsing/copying per run. Since translators are stateless, memoize
   the per-run translator by `localeData` identity (`WeakMap<localeData, translator>`) so it's built
   once per pack, not once per run.

4. **Decide what happens to `system` and the default source.** `system` is a structural pseudo-locale
   (test-stability base), not a human locale, and does **not** scale with locale count.
   Recommended: keep `system` (and possibly `en`, the authored source-of-truth, which is small and
   always available) bundled as the synchronous structural base, and take only the active _non-default_
   locale via `localeData`. **Confirm this with Jeremy** — it's a judgement call under "no fallback"
   (does an `en`-locale run inject `en` too, or use the bundled `en`?).

5. **Keep the catalogs as authored source + build-export.** The `locales/<locale>/translation.json`
   files stay (you author them). They will be build-exported per locale to R2 and fetched by the app
   the same way curriculum catalogs are — that export + fetch is app/build work, not this task, but
   don't do anything that prevents it (i.e. don't rely on them being import-bundled at runtime).

## Constraints

- **Never auto-translate `hu`** (or any locale). Add new keys to `en` (and `system` where relevant)
  only; Jeremy triggers real translations himself. Keep `en` and any present non-`en` key trees
  identical.
- Follow existing i18next conventions (`escapeValue: false` so `<code>`/HTML and interpolation pass
  through untouched).
- No `any`. Typecheck clean.
- **Run the downstream tests** — interpreter changes ripple: run interpreters, curriculum, AND app
  tests (`pnpm test:interpreters`, `pnpm test:curriculum`, `pnpm test:app`).
- Don't touch the LogicError/FunctionExecutionError passthroughs (see Scope).
- **Git:** currently frozen on this effort — check with Jeremy before committing. Work on the current
  branch; do not auto-create branches.

## References (read before coding)

- `~/.claude/plans/fizzy-munching-peacock.md` — the existing JS interpreter i18n extraction plan
  (error catalog leak-fixes + a guard test + describers). This task **extends/overlaps** it; that plan
  currently assumes the `changeLanguage` global model, so reconcile: this task replaces the global with
  per-run injected `localeData`. The plan's Phase 1 (type-noun resolution, guard test) is still valuable.
- `front-end/i18n_TODO.md` — master plan; the **Interpreter** section is this task.
- `curriculum/.context/i18n.md` — the curriculum-side companion; the model and the `createTranslator`
  pattern to mirror.
- `curriculum/src/i18n/translator.ts` — reference implementation of the per-run inject-the-dict translator.

## Definition of done

- Interpreter resolves its own errors against a per-run injected `localeData`; no static bundling of
  all locales; no `fallbackLng`; global `changeLanguage` gone.
- `system`/default-`en` handling decided with Jeremy and implemented.
- Guard test for catalog parity (en vs any present locale, valid ICU/i18next interpolation, no stray
  whitespace) added if not already present.
- Interpreter + curriculum + app test suites green; typecheck + lint clean.
- LogicError/FunctionExecutionError passthroughs untouched.
