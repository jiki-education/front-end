# Instructions for coding assistants

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create a new feature branch
git checkout -b feature-branch-name
```

---

This file provides guidance to AI agents when working with code in this repository.

## Context Files

The `.context/` directory contains detailed documentation for this codebase. **Read any files relevant to the task you are working on. Even if the file is only tangentially relevant, read it to be sure.**

You can read these files at **any point during your work** - even in the middle of implementing a plan if appropriate.

| File              | When to Read                                                 |
| ----------------- | ------------------------------------------------------------ |
| `coding-style.md` | **Always read first** - coding style and file organization   |
| `commands.md`     | **Always read** - running dev server, tests, builds, linting |
| `testing.md`      | Writing or editing tests                                     |
| `eslint.md`       | Fixing lint errors, adding lint exceptions                   |
| `css-styles.md`   | CSS styling (CSS Modules + UI Kit)                           |
| `images.md`       | Working with icons, SVGs, or images                          |
| `architecture.md` | Understanding project structure                              |
| `tech-stack.md`   | Technologies, frameworks, dependencies                       |
| `modals.md`       | Global modal system                                          |
| `toasts.md`       | Toast notifications                                          |
| `content.md`      | Blog posts and articles integration                          |
| `i18n.md`         | Internationalization, locales, search indexes                |
| `about-jiki.md`   | Jiki platform overview                                       |
| `deployment.md`   | Deployment process                                           |
| `git.md`          | Git hooks configuration                                      |

### Coding Exercise Context Files

When working on the coding exercise component, also read from `.context/coding-exercise/`:

| File                         | When to Read                         |
| ---------------------------- | ------------------------------------ |
| `orchestrator-pattern.md`    | State management, orchestrator class |
| `codemirror.md`              | Code editor integration              |
| `scrubber-frames.md`         | Frame system and timeline            |
| `scrubber-implementation.md` | Scrubber UI                          |
| `test-runner.md`             | Test execution system                |

## Quick Start

### Development

```bash
./bin/dev
```

Starts the development server on http://localhost:3061. Never start or stop the dev server yourself — ask the human to run it.

### Build, TypeScript & Lint

```bash
pnpm typecheck   # Check TypeScript types (run from monorepo root)
pnpm run lint    # Run ESLint
pnpm run build   # Production build with Turbopack (AVOID - breaks dev server)
```

**IMPORTANT**:

- **Always use `pnpm typecheck` for TypeScript checking** (run from the monorepo root) instead of `pnpm run build`. Running the build command can cause the dev server to break with ENOENT errors for buildManifest.js.tmp files due to Turbopack cache conflicts.
- Before fixing any ESLint errors, always read `.context/eslint.md` for guidelines on handling lint issues and when to add exception comments.

## Project Structure Patterns

This is the frontend for Jiki, a learn-to-code platform.

### Core Technology Stack

- **Framework**: Next.js 15 with App Router, TypeScript
- **UI Library**: React 19 with React Compiler (automatic optimization)
- **Styling**: CSS Modules + a hand-written UI Kit. An ESLint rule blocks ad-hoc utility-style classes in `className`. See `.context/css-styles.md`.
- **Deployment**: Cloudflare Workers (Edge Runtime)
- **Package Manager**: pnpm

**Note**: React Compiler is enabled, so manual memoization (`useMemo`, `useCallback`, `memo()`) is generally not needed.

**Staging**: `staging.jiki.io` (`jiki-app-staging` Worker) must be deployed via the Deploy Staging GitHub Action **before** the Terraform custom-domain apply — the domain can't attach to a Worker service that doesn't exist yet.

**Deploying a branch/PR to staging**: run the `Deploy Staging` workflow (`gh workflow run deploy-staging.yml --ref <branch>`) — the dispatched ref is what deploys to `staging.jiki.io` (there is no separate `ref` input). **Only ever do this if the user explicitly asks, and treat each run as needing its own fresh explicit request** — it publishes real, working code to a live environment against the production API.

### Organizational Patterns

#### Component Organization

Components follow a hierarchical pattern:

- **Feature-based folders** in `/components/` (e.g., `coding-exercise/`)
- **UI subfolder** for presentational components within features
- **Lib subfolder** for business logic and utilities
- **Single responsibility** - each component has one clear purpose

#### State Management Patterns

- **Orchestrator pattern** for complex features needing centralized state
  - Class-based orchestrator with instance-based Zustand store
  - Hook exports for React component integration
  - Clear separation: read via hooks, write via orchestrator methods
- **Local state** with useState/useReducer for simple components
- **No global stores** - all state is scoped to component trees

#### Testing Patterns

Tests mirror source structure but are centralized:

- `tests/unit/components/[feature]/` mirrors `components/[feature]/`
- Parent component tests focus on integration
- Child component tests focus on specific functionality
- Consistent mock helper functions at top of test files

#### File Organization Within Components

Components follow a top-to-bottom flow:

1. Imports
2. Types/Interfaces
3. Main component (what it renders)
4. Sub-components (if any)
5. Event handlers (can be module-level for testability)
6. Helper functions (implementation details)

This pattern makes components readable from high-level to low-level details.

## Colors

Always use colors from the standard palettes defined in `app/styles/theme/colors.css`, via `var(--color-*)`. Do not use arbitrary colors. Note that these palettes (blue, green, etc) may not be 1-1 with "normal" palettes — consider the colors in this file canonical.

If you need an arbitrary color, always confirm with the user first, explaining why it's required. If the color is close to a color in our palettes, suggest that to the user as an alternative.

## Architecture Principles

- **Feature isolation**: Each feature is self-contained with its own components, logic, and tests
- **Prop drilling over context**: Pass orchestrators/props explicitly for clarity
- **Composition over inheritance**: Use component composition and hooks
- **Type safety everywhere**: Full TypeScript with strict mode
- **Performance by default**: Edge deployment, code splitting, lazy loading

## Development Guidelines

- **Match existing patterns** - Look at similar features before implementing new ones
- **Use semantic HTML** and accessibility attributes
- **Mobile-first responsive design** via CSS Module media queries (`@media (min-width: …)`)
- **Path alias** `@/*` maps to project root for clean imports
- **Commit regularly** to save progress (but never on main branch)
- **Never add metadata to `/dev` routes** - Development pages under `/dev/` use `"use client"` for interactive testing and cannot export metadata. Next.js does not allow metadata exports from client components.

### Exercise Content Cache

Exercise content is served as static files, separate from the exercise modules in `@jiki/curriculum`. **Prose and code are separate artifacts**, split along the axis each actually varies on: instructions are translated (they vary by locale), while stubs and solutions are code (they vary by programming language and never by locale). Sharing one artifact made translated instructions impossible to publish from the `i18n` repo, which holds no code. See the repo root's `.context/i18n.md` § "The Exercise Cache".

- **Build script**: `scripts/generate-exercise-cache.js` reads curriculum source files and produces:
  - `public/static/exercises/{locale}/index-{hash}.json` — prose index (slug/title/description/proseHash)
  - `public/static/exercises/{slug}/{locale}/prose-{hash}.json` — instructions
  - `public/static/exercises/code/{language}/index-{hash}.json` — code index (slug -> hash)
  - `public/static/exercises/{slug}/code/{language}/code-{hash}.json` — stub + solution
  - `public/static/exercises/{locale}/current.json` — local dev pointer for non-English locales, never uploaded (on R2 the `i18n` repo is the single writer of these)
  - `lib/generated/exercise-hashes.ts` — hash manifests for both index kinds
  - `lib/generated/exercise-levels.ts` — slug -> levelId, compiled in with no pointer. Which
    level an exercise belongs to is neither prose nor code (it varies by neither locale nor
    language), so it is its own front-end-owned manifest rather than a field in an index the
    i18n repo republishes. `lib/exercises/published.ts` pairs it with the ordered level
    registry and `LAST_PUBLISHED_LEVEL_SLUG` so the sitemap lists only live exercises.
- **Client API**: `lib/api/exercise-meta.ts` provides `getExerciseMetaBySlugs()` and `fetchExerciseContent()`, which fetches the two indexes concurrently and then prose and code concurrently, so the split adds no round trip
- **Exercise loading**: `useExerciseLoader` loads the exercise module (ExerciseCore) and static content in parallel, then assembles into `ExerciseDefinition`
- **Dev/build commands**: `exercise-cache:generate` and `exercise-cache:watch` (wired into `dev` and `build`)
- **Generated files are gitignored**: `public/static/exercises/` and `lib/generated/`

### Video Cache

Every video is authored once in `curriculum/src/videos/videos.json`, keyed by video slug as a map of locale to source plus a required `fallback`. It is resolved per locale at build time and published as a **front-end-owned artifact, never as part of a copy catalog**: the `i18n` repo republishes those per locale as closed literals, so a video field folded in there works in English and silently disappears in every locale that repo publishes. See `.context/i18n.md` § "The Video Cache".

- **Build script**: `scripts/generate-video-cache.js` produces:
  - `public/static/videos/{locale}/index-{hash}.json` — `{ sources: { videoSlug -> VideoSource }, refs: { conceptSlug|exerciseSlug -> videoSlug } }`
  - `lib/generated/video-hashes.ts` — locale -> hash manifest, **compiled in with no pointer**, because videos change only when this repo deploys
- **Resolution**: `lib/videos/select.ts` — `videoIndexTargetFor()` picks which locale's index to read, `videoFor()` follows a ref or treats the slug as a video slug (a video lesson's slug IS its video slug)
- **Clients**: `lib/api/videos.ts` (browser) and `lib/videos/server-videos.ts` (SSR); both join an existing `Promise.all`, so no extra round trip of depth
- **Only locales with their own recording are emitted**; everything else reads the default locale's index
- **Dev/build commands**: `video-cache:generate` and `video-cache:watch` (wired into `dev` and `build`)
- **Generated files are gitignored**: `public/static/videos/`

### Translated Content in Development

Translations live in the separate `i18n` repo and reach production via R2, not via this repo's build. Building them locally is **off by default**: watching `../../i18n/locales/**` means chokidar holding thousands of files across every locale and a republish every time that repo changes underneath you, which is a lot of CPU to spend on locales you are usually not looking at. Anything published earlier stays on disk, so the last locales you built are still browsable, just frozen.

To turn them on, clone `i18n` beside the front-end (or set `JIKI_I18N_REPO`) and run `./bin/dev --all-locales`. That sets `JIKI_ALL_LOCALES=1`, which is what `i18n-content:generate` and the `scripts/watch-i18n-content.js` guard in front of the watcher both check; without it they exit 0 and the watcher never spawns. The watcher republishes only the locale whose file changed (the first segment under `locales/`), falling back to a full publish for anything it cannot place: one locale is ~0.4s and ~550 files against ~2.2s and ~7,800 for all of them, which matters when every save during a translation pass triggers it. Per-locale is as narrow as it can safely go, since a locale's indexes are assembled from its whole corpus and embed the content hashes of the files they point at.

That script runs the **i18n repo's own publisher** with `--out-dir`, so the local tree is the same bytes at the same paths the R2 objects would be, produced by the same code. With no `i18n` checkout it prints one line and exits 0, so nothing is required of anyone who does not need translations. It is deliberately **not** part of `build`: a production build gets non-English content from R2 on the i18n repo's cadence, and baking a snapshot in would pin every locale to whatever was on disk at build time.

### Static Assets Organization

All static assets served from the `public` directory must be placed in `public/static/`:

- **`public/static/images/`** - Static images (PNGs, JPGs, etc.)
- **`public/static/sounds/`** - Audio files
- **`public/static/*.js`** - Static JavaScript files (e.g., theme-script.js)
- **`public/static/*.png`** - Root-level images (e.g., robot.png)

```typescript
import Image from "next/image";

<Image src="/static/images/photo.png" alt="Photo" />
```

**Why `/static/`?** This organization enables simple Cloudflare cache rules - authenticated users bypass cache for dynamic pages but always cache `/static/*` assets. See `terraform/cloudflare/cache_rules.tf`.

**IMPORTANT:** When adding new static assets (images, fonts, audio, etc.), always place them in `public/static/` to ensure proper caching behavior. If you need to add a new type of static asset, update the Terraform cache rule expression in `cache_rules.tf` to explicitly include it.

### SVG Icons

SVG icons are stored in `app/icons/` and imported as React components via SVGR. Always use the `@/icons/` alias:

```typescript
import SettingsIcon from "@/icons/settings.svg";

<SettingsIcon className={styles.icon} />
```

See `.context/images.md` for detailed icon usage guidelines.

## Internationalization (i18n)

See the repo root's `.context/i18n.md` for the full model and the **Adding a New Locale** checklist.

**RTL languages:** when adding a right-to-left locale (Arabic `ar`, Hebrew `he`, Persian `fa`, Urdu `ur`, etc.), you MUST also add its code to `RTL_LOCALES` in `lib/locales.ts`. That set drives `dir` on `<html>` via `getLocaleDirection()`, so omitting it leaves the whole UI stuck left-to-right for that locale. (LTR-only locales need no direction change - the default is `ltr`.)

## Testing Guidelines

**IMPORTANT: Always read `.context/testing.md` before writing tests**

- Unit tests MUST be placed in `tests/unit/` directory
- Integration tests go in `tests/integration/` directory
- E2E tests go in `tests/e2e/` directory
- Never place test files alongside source files
- **ALWAYS run `pnpm typecheck` after running tests to check for TypeScript errors**

## Important Rules

1. **Documentation is current state** - All documentation in .context and AGENTS.md should reflect the current state of the codebase. Never use changelog format that documents iterative changes or corrections. Focus on documenting the current implementation.

   ✅ **GOOD EXAMPLE** (current state documentation):

   ```markdown
   The `/dev` route provides development-only tools.
   ```

   ❌ **BAD EXAMPLE** (changelog-style writing):

   ```markdown
   The `/dev` route provides development-only tools.
   **Note**: Folders prefixed with underscore (e.g., `_dev`) are treated as private by Next.js and don't create routes, so we use `/dev` instead.
   ```

2. **Avoid code duplication in context files** - Don't include large code blocks in context documentation when the actual code is just as easy for an LLM to look up. Instead, reference file paths and describe the functionality. Keep instructional examples and diagrams that explain concepts.

   ✅ **GOOD**: "See `components/coding-exercise/lib/Orchestrator.ts` for the implementation"

   ❌ **BAD**: Including entire class definitions or method implementations in context files

3. **Continuous learning** - When you learn something important or make a mistake, immediately update the relevant .context file to prevent future errors
4. **Regular commits** - Git commit regularly to save progress (always on feature branches, never on main)
5. **Post-task documentation** - Before committing, always check if any .context files need updating to reflect the new state of the codebase
6. **Ask, don't guess** - Prefer asking questions over making assumptions. If multiple approaches exist, ask which to use
