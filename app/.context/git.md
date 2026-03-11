# Git Configuration

## Git Hooks

This project uses Husky to manage Git hooks that ensure code quality before commits.

### Pre-commit Hook

The pre-commit hook (`.husky/pre-commit`) runs automatically before each commit and performs the following checks:

1. **TypeScript Type Checking** (🔷)
   - Runs `npx tsc --noEmit` to check for TypeScript type errors
   - Blocks commit if any type errors are found

2. **Code Formatting** (💅)
   - Automatically formats staged files using Prettier
   - Only processes changed files with extensions: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.json`, `.md`, `.yml`, `.yaml`
   - Formatted files are automatically re-staged

3. **Linting** (🔍)
   - Runs `eslint --fix` on staged files, then re-stages any auto-fixed files
   - Runs a second ESLint pass with `--max-warnings=0` to catch remaining issues
   - Blocks commit if any unfixable errors or warnings remain

4. **Testing** (🧪)
   - Runs all tests via `pnpm test`
   - Blocks commit if any tests fail

If any check fails, the commit is aborted with an error message indicating which check failed.

### Hook Management

- Hooks are installed automatically via `pnpm install` (through the `prepare` script)
- To bypass hooks temporarily (not recommended): `git commit --no-verify`
- To modify hooks: Edit files in `.husky/` directory
