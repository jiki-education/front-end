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
| `css-styles.md`   | CSS styling (Tailwind, UI Kit, CSS Modules)                  |
| `images.md`       | Working with icons, SVGs, or images                          |
| `architecture.md` | Understanding project structure                              |
| `tech-stack.md`   | Technologies, frameworks, dependencies                       |
| `modals.md`       | Global modal system                                          |
| `toasts.md`       | Toast notifications                                          |
| `content.md`      | Blog posts and articles integration                          |
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
./bin/dev-claude
```

Starts the development server on http://localhost:3071

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
- **Styling**: Tailwind CSS v4
- **Deployment**: Cloudflare Workers (Edge Runtime)
- **Package Manager**: pnpm

**Note**: React Compiler is enabled, so manual memoization (`useMemo`, `useCallback`, `memo()`) is generally not needed.

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

Always use colors from the standard palettes defined in `app/styles/theme/colors.css`. Use variable names or tailwind classes, not arbitrary colors. Note that the color palettes in this (blue, green, etc) may not be 1-1 with "normal" palettes such as tailwind. Consider the colors in this file to be canonical.

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
- **Mobile-first responsive design** with Tailwind
- **Path alias** `@/*` maps to project root for clean imports
- **Commit regularly** to save progress (but never on main branch)
- **Never add metadata to `/dev` routes** - Development pages under `/dev/` use `"use client"` for interactive testing and cannot export metadata. Next.js does not allow metadata exports from client components.

### Static Assets Organization

All static assets served from the `public` directory must be placed in `public/static/`:

- **`public/static/icons/`** - SVG icon files (symlinked to `/icons/`)
- **`public/static/images/`** - Static images (PNGs, JPGs, etc.)
- **`public/static/sounds/`** - Audio files
- **`public/static/*.js`** - Static JavaScript files (e.g., theme-script.js)
- **`public/static/*.png`** - Root-level images (e.g., robot.png)

**Import using `@static` alias:**

```typescript
import Logo from "@static/icons/logo.svg";
import Image from "next/image";

<Image src="/static/images/photo.png" alt="Photo" />
```

**Why `/static/`?** This organization enables simple Cloudflare cache rules - authenticated users bypass cache for dynamic pages but always cache `/static/*` assets. See `terraform/cloudflare/cache_rules.tf`.

**IMPORTANT:** When adding new static assets (images, fonts, audio, etc.), always place them in `public/static/` to ensure proper caching behavior. If you need to add a new type of static asset, update the Terraform cache rule expression in `cache_rules.tf` to explicitly include it.

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
