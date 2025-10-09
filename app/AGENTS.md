# Instructions for coding assistants

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch using git worktree:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create a new feature branch
git checkout -b feature-branch-name

# 3. Create an isolated worktree directory
git worktree add ../../worktrees/front-end-app-feature-branch feature-branch-name

# 4. Change to the worktree directory
cd ../../worktrees/front-end-app-feature-branch/app
```

This isolates your work in a separate directory. Never work directly in the main repository directory.

---

This file provides guidance to AI agents when working with code in this repository.

## Context Documentation

Context files explain how everything works. If the human MENTIONS something that MIGHT BE explained by one or more of these files, READ THE FILES before putting together any plan or action.

### Documentation Structure

- **[.context/README.md](.context/README.md)** - **ALWAYS READ THIS FILE BEFORE WORKING ON ANY INSTRUCTION. THIS IS THE FIRST THING YOU DO WHEN A HUMAN GIVES YOU AN INSTRUCTION** - Overview of all context documentation
- **[.context/coding-exercise/README.md](.context/coding-exercise/README.md)** - Complex exercise system overview

### General Context Files

Load the relevant context files from `.context/` directory based on your task:

- **[.context/coding-style.md](.context/coding-style.md)** - **ALWAYS READ THIS FIRST** - Coding style and file organization guidelines
- [.context/about-jiki.md](.context/about-jiki.md) - Overview of Jiki platform and business model
- [.context/commands.md](.context/commands.md) - Development commands and scripts. **ALWAYS READ THIS FILE WHEN STARTING ON A TASK**.
- [.context/tech-stack.md](.context/tech-stack.md) - Technologies, frameworks, and dependencies
- [.context/architecture.md](.context/architecture.md) - Frontend architecture and design decisions
- [.context/deployment.md](.context/deployment.md) - Deployment process and configuration
- [.context/git.md](.context/git.md) - Git hooks configuration
- [.context/testing.md](.context/testing.md) - Testing setup and guidelines. **ALWAYS READ THIS BEFORE EDITING OR ADDING TESTS.**
- [.context/eslint.md](.context/eslint.md) - ESLint configuration and how to handle lint errors. **ALWAYS READ THIS BEFORE LINTING**
- [.context/toasts.md](.context/toasts.md) - Toast notifications with react-hot-toast
- [.context/modals.md](.context/modals.md) - Global modal system
- [.context/content.md](.context/content.md) - Content integration for blog posts and articles

### Complex Exercise Context Files

When working on the complex exercise component, load these files from `.context/coding-exercise/`:

- [.context/coding-exercise/orchestrator-pattern.md](.context/coding-exercise/orchestrator-pattern.md) - Orchestrator pattern for complex state management
- [.context/coding-exercise/codemirror.md](.context/coding-exercise/codemirror.md) - CodeMirror editor integration
- [.context/coding-exercise/scrubber-frames.md](.context/coding-exercise/scrubber-frames.md) - Frame system and timeline
- [.context/coding-exercise/scrubber-implementation.md](.context/coding-exercise/scrubber-implementation.md) - Scrubber UI implementation
- [.context/coding-exercise/test-runner.md](.context/coding-exercise/test-runner.md) - Test execution system

## Quick Start

### Development

```bash
./bin/dev-claude
```

Starts the development server on http://localhost:3071

### Build, TypeScript & Lint

```bash
npx tsc --noEmit # Check TypeScript types (use this instead of build)
pnpm run lint    # Run ESLint
pnpm run build   # Production build with Turbopack (AVOID - breaks dev server)
```

**IMPORTANT**:

- **Always use `npx tsc --noEmit` for TypeScript checking** instead of `pnpm run build`. Running the build command can cause the dev server to break with ENOENT errors for buildManifest.js.tmp files due to Turbopack cache conflicts.
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

## Testing Guidelines

**IMPORTANT: Always read `.context/testing.md` before writing tests**

- Unit tests MUST be placed in `tests/unit/` directory
- Integration tests go in `tests/integration/` directory
- E2E tests go in `tests/e2e/` directory
- Never place test files alongside source files
- **ALWAYS run `npx tsc --noEmit` after running tests to check for TypeScript errors**

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
