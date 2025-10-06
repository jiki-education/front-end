# Jiki Interpreters

A collection of interpreters for Jiki's educational coding environment.

## Interpreters

This project contains multiple educational interpreters:

- **JikiScript** - Educational language with simplified JavaScript-like syntax (fully implemented)
- **JavaScript** - Standard JavaScript interpreter (in development)
- **Python** - Python interpreter (basic implementation)

All interpreters generate frame data that powers Jiki's interactive editor features:

- **Breakpoints**: Step-by-step code execution
- **Time Scrubber**: Navigate through execution history
- **Variable Inspection**: Track variable states over time
- **Execution Visualization**: See how code flows through different paths

## Features

- Execute student code in controlled environments
- Capture execution traces with variable states
- Generate timeline data for interactive debugging
- Support for educational code analysis and feedback

## Development

### Commands

- **Build**: `pnpm run build` - Build the package for distribution
- **Test**: `pnpm test`
- **Type Check**: `pnpm run typecheck`
- **Format**: `pnpm run format`

### Build System

This package uses a two-step build process:

1. **TypeScript Compiler (`tsc`)** - Generates type definitions (`.d.ts` files) for TypeScript consumers
2. **esbuild** - Bundles all modules into a single ESM file, resolving path aliases and dependencies

#### Why esbuild is Required

The codebase uses TypeScript path aliases (e.g., `@jikiscript/*`, `@utils/*`) for cleaner imports. While this improves development experience, these aliases must be resolved during the build process:

- **TypeScript alone** only compiles files individually and doesn't resolve path aliases in the output JavaScript
- **esbuild** bundles everything into a single file, properly resolving all path aliases and creating a self-contained module
- The bundled output works in both browser and Node.js environments
- External dependencies like `i18next` are marked as external to avoid bundling them

Without esbuild, the compiled JavaScript would contain unresolved imports like `import ... from '@utils/toSentence'` which would fail at runtime.

### CI/CD

The project uses parallel GitHub Actions workflows for CI: tests, type checking, and formatting.

---

Copyright (c) 2025 Jiki Ltd. All rights reserved.
