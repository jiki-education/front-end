# Development Commands

## Core Commands

- `./bin/dev-claude` - Start development server on port 3071 (for AI assistants)
- `npx tsc --noEmit` - Check TypeScript types (preferred for type checking)
- `pnpm run lint` - Run ESLint for code quality checks
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting without changing files
- `pnpm run build` - Build production bundle (CAUTION: can break dev server)
- `pnpm run start` - Start production server

## Testing Commands

### Unit/Integration Tests

- `pnpm test` - Run unit tests once
- `pnpm test:watch` - Run unit tests in watch mode
- `npx tsc --noEmit` - Run after tests to check for TypeScript errors

### E2E Tests

- `pnpm test:e2e` - Run E2E tests with shared server (fast)
- `pnpm test:e2e:watch` - Run E2E tests in watch mode
- `pnpm test:e2e:headful` - Run E2E tests with visible browser
- `pnpm test:all` - Run both unit and E2E tests
- `pnpm test:e2e -- tests/e2e/home.test.ts` - Run specific test file

### Setup

- `npx puppeteer browsers install chrome` - Install Chrome browser for Puppeteer E2E tests (required after fresh clone)

## Code Quality Commands

### Dead Code Detection

- `npx knip` - Run knip to detect unused code, dependencies, and exports across the codebase
- `npx tsx scripts/analyze-exports.ts [file]` - Analyze specific file for unused exports and class members
- `/cleanup [target]` - Claude Code slash command for automated dead code cleanup (requires approval before changes)

## Package Management

This project uses pnpm with workspaces for monorepo management:

- `pnpm install` - Install dependencies (including workspace packages)
- `pnpm add [package]` - Add new dependency
- `pnpm remove [package]` - Remove dependency
- `pnpm prepare` - Set up Husky git hooks (runs automatically after install)

## Development Server

The dev server runs on port 3061 by default:

- URL: http://localhost:3061
- Uses webpack (Turbopack disabled due to pnpm workspace compatibility issues)
- Hot module replacement enabled

### Important Notes

- **Build Command**: Avoid using `pnpm run build` during development as it can cause the dev server to break with ENOENT errors for buildManifest.js.tmp files
- **Turbopack**: Currently disabled due to incompatibility with pnpm workspaces and the interpreters package. Using webpack instead
- **Type Checking**: Always use `npx tsc --noEmit` for type checking instead of the build command
