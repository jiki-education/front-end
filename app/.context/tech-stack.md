# Tech Stack

## Core Technologies

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0 with React Compiler
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **Deployment Target**: Cloudflare Workers

### React 19 & React Compiler

This project uses React 19 with the React Compiler (formerly React Forget) enabled. The React Compiler automatically optimizes components by:

- Auto-memoizing components and hooks without manual `useMemo`, `useCallback`, or `memo()`
- Preventing unnecessary re-renders through compile-time optimizations
- Reducing bundle size by eliminating manual memoization code

The compiler is configured in `next.config.ts` with `experimental.reactCompiler: true` and applies to all components in the codebase. This means:

- You generally don't need to manually memoize values or callbacks
- Components are automatically optimized for performance
- The compiler handles dependency tracking and optimization

## Key Dependencies

- **Code Editor**: CodeMirror 6 with custom extensions
- **Animations**: anime.js 4.1.3
- **State Management**: Zustand 5.0.8
- **Markdown**: marked 16.3.0
- **Interpreters**: Custom workspace package for code execution
- **Utilities**: lodash, diff
- **Syntax Highlighting**: highlight.js with custom JikiScript support

## Development Tools

- **Linting**: ESLint 9 with Next.js config
- **Formatting**: Prettier with consistent code style
- **Testing**: Jest (unit), Playwright (E2E)
- **Build Tool**: webpack (Turbopack disabled due to pnpm workspace incompatibility)
- **Type Checking**: TypeScript strict mode enabled
- **Git Hooks**: Husky for pre-commit checks

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - React components organized by feature
- `/utils` - Shared utility functions
- `/tests` - Test files (unit, integration, e2e)
- `/public` - Static assets
- `/scripts` - Build and development scripts
- `/bin` - Utility scripts (e.g., dev server launcher)

## Configuration

- TypeScript paths: `@/*` maps to project root
- Strict TypeScript mode enabled
- ES2022 compilation target
- Module resolution: bundler
- pnpm workspaces for monorepo structure
