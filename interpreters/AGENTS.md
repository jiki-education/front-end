# Agent Configuration

## ⚠️ IMPORTANT: Check .context/ Directory FIRST

**BEFORE making ANY changes or answering questions about this codebase, you MUST check the `.context/` directory for detailed technical information.**

The `.context/` folder contains comprehensive documentation about:

- **Shared Architecture** (`.context/shared/`)
  - **MANDATORY**: [Interpreter Architecture](./context/shared/interpreter-architecture.md) - Critical patterns ALL interpreters must follow
  - **COMMON ISSUES**: [Common Issues](./context/shared/common-issues.md) - Mistakes to avoid that break UI compatibility or issues LLMs often run into on this code base.
- **JikiScript interpreter** (`.context/jikiscript/`)
  - Architecture (Scanner→Parser→Executor→Frames pipeline)
  - Key concepts (JikiObjects, Frames, EvaluationResults)
  - Educational features and progressive syntax
  - Implementation details and component relationships
- **JavaScript interpreter** (`.context/javascript/`)
  - Architecture overview and pipeline details
  - Modular executor system with describers
  - Frame generation for UI integration
  - Recent architecture alignment (2025-01)
- **Python interpreter** (`.context/python/`)
  - Architecture documentation and implementation details
  - Python-specific features and object system
  - Educational Python syntax and frame generation
  - Recent architecture alignment (2025-01)

**Always start by reading the relevant `.context/` files to understand the system before proceeding with any task.**

## ⚠️ CRITICAL: Error Handling & System Messages

**ALL interpreters MUST follow the shared error handling pattern:**

- **Parse Errors**: Returned as `error` with empty `frames[]`
- **Runtime Errors**: Always `error: null`, runtime errors become error frames with `status: "ERROR"`
- **System Messages**: Use format `"ErrorType: context: value"` (e.g., `"VariableNotDeclared: name: x"`)
- **Test Language**: Set to `"system"` for error message tests to ensure consistency

**Any deviation from this pattern WILL break UI compatibility. See [Common Errors](./context/shared/common-errors.md) for detailed examples of what NOT to do.**

## 🚨 ESSENTIAL DEVELOPMENT REMINDERS

**On EVERY development task, you MUST:**

1. **Update Evolution Documentation**: Add all significant changes to `.context/evolution.md` or `.context/[interpreter]/evolution.md` following the guidelines in [Documentation Guidelines](.context/documentation-guidelines.md)

2. **Preserve Historical Information**: Never delete point-in-time information - move it to appropriate evolution documents

3. **Follow Architecture Patterns**: Strictly adhere to shared interpreter architecture patterns for UI compatibility

4. **Update Both Translation Files**: When adding errors, update both `system/translation.json` and `en/translation.json`

5. **Test Error Handling**: Set language to "system" for runtime error tests

6. **Maintain Context Size**: Keep documentation concise - extract detailed examples to evolution documents

**These reminders ensure consistency across the entire Jiki interpreter ecosystem.**

## Instructions

If you are asked to work on a TODO, look at TODO.md. Read the instructions at the top. Ensure to CONFIRM WITH A HUMAN between the execution plan and the coding. Ensure to commit at the end.
If you are asked to do a job, confirm your understand and an execution plan before acting.

## Project Overview

This is a TypeScript project that houses multiple educational interpreters for **Jiki** (by the Exercism team). Jiki is an educational coding environment that provides interactive, frame-by-frame code execution visualization.

### Interpreters

- **JikiScript** (implemented) - Educational language with simplified JavaScript-like syntax
  - Full documentation in `.context/jikiscript/`
  - Complete Scanner→Parser→Executor→Frames pipeline
  - Educational features and progressive syntax support
- **JavaScript** (in development) - Standard JavaScript interpreter
  - Documentation in `.context/javascript/`
  - Scanner, Parser, and basic Executor implemented
  - Supports arithmetic, logical, and comparison operations
  - Describers system for educational explanations
  - Frame generation compatible with Jiki UI
- **Python** (basic implementation) - Python interpreter
  - Documentation in `.context/python/`
  - Scanner, Parser, and basic Executor implemented
  - Supports numeric literals (integers, floats, scientific notation)
  - PyObjects system extending shared JikiObject base class
  - Frame generation compatible with Jiki UI

All interpreters generate the same frame format to power Jiki's unified UI, allowing students to learn different languages with consistent visual debugging tools.

### Key Educational Features

- **Frame-by-frame execution**: Students can scrub through code execution like a video timeline
- **Variable inspection**: Track how variables change over time
- **Line-by-line descriptions**: See exactly what each line of code does
- **Progressive language features**: Enable/disable syntax to gradually introduce concepts
- **Educational feedback**: Descriptive error messages and execution explanations

For detailed technical information, see the `.context/` folder, particularly `.context/jikiscript/` for the current interpreter.

## Commands

- **Dev**: `pnpm run dev` - Runs in watch mode
- **Test**: `pnpm test` - Runs all tests using Vitest
- **Test Watch**: `pnpm test:watch` - Runs tests in watch mode
- **Type Check**: `pnpm run typecheck` - Type checking without emit
- **Format**: `pnpm run format` - Format code with Prettier
- **Format Check**: `pnpm run format:check` - Check if code is formatted
- **Clean**: `pnpm run clean` - Removes dist/ folder

## CI/CD

The project uses GitHub Actions with three parallel workflows:

- **Tests** (`.github/workflows/tests.yml`) - Runs `pnpm test`
- **Type Check** (`.github/workflows/typecheck.yml`) - Runs `pnpm run typecheck`
- **Format Check** (`.github/workflows/format.yml`) - Runs `pnpm run format:check`

All workflows run on pushes to `main` and pull requests targeting `main`. The parallel setup ensures fast feedback for developers.

## Directory Structure

- `src/` - Source TypeScript files
- `tests/` - Test files (Vitest test runner)
- `examples/` - Example JikiScript programs
- `docs/` - Documentation
- `dist/` - Built output (generated)

## Code Style

- Use TypeScript with strict mode enabled
- Follow ESNext module syntax
- Use Vitest test runner for testing
- Prefer `export/import` over `require()`

## Testing

- Use Vitest test runner: `pnpm test`
- Test files should be in `tests/` directory
- Use `.test.ts` suffix for test files
- **NEVER comment out or disable tests to make things "work"** - always fix the underlying issue properly
- If tests are failing, identify and resolve the root cause rather than masking the problem
- **ABSOLUTELY NEVER use `--no-verify` flag when committing without explicit permission from the user**
- **ALL tests MUST pass before considering a task complete - failing tests mean the work is NOT done**

## Version Control Guidelines

**⚠️ CRITICAL: ALWAYS use feature branches for development - NEVER commit directly to main.**

**IMPORTANT: Always commit your changes when you complete an instruction or task.**

- **ALWAYS create a feature branch before starting work** (e.g., `git checkout -b feature/add-new-operator`)
- Create descriptive commit messages that explain what was changed and why
- Commit after finishing each discrete task or instruction
- This ensures work is saved and provides clear history of changes
- Use conventional commit format when appropriate
- Include context about the implementation in commit messages
- Push your feature branch and create a pull request when ready for review

## Notes

- This project uses pnpm as the package manager
- TypeScript configuration with esbuild for bundling
- Tests use Vitest with globals enabled for minimal migration effort

---

## Common Mistakes

- Never use `HEADLESS=true CI=true pnpm test:e2e` - just use `pnpm test:e2e`.
