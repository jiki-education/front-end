# Jiki Monorepo

This is the monorepo for Jiki's frontend platform, containing the Next.js application and its supporting packages.

## About Jiki

Jiki is a hands-on coding education platform launching in January 2026. It provides a structured, linear pathway for beginners to learn programming through problem-solving and interactive games.

## Packages

This monorepo contains three packages:

- **[app/](app/)** - Next.js frontend application (main user-facing platform)
- **[curriculum/](curriculum/)** - Exercise content library and educational materials
- **[interpreters/](interpreters/)** - Language interpreters (JikiScript, JavaScript, Python)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm 10.x or higher

### Installation

```bash
# Install all dependencies for all packages
pnpm install
```

### Development

```bash
# Run the main application
pnpm dev:app

# Run tests for all packages
pnpm test

# Run tests for a specific package
pnpm test:app
pnpm test:curriculum
pnpm test:interpreters
```

### Common Commands

```bash
# Type checking across all packages
pnpm typecheck

# Linting across all packages
pnpm lint

# Format code across all packages
pnpm format

# Check formatting across all packages
pnpm format:check
```

## Project Structure

```
monorepo/
├── app/              # Next.js frontend application
├── curriculum/       # Exercise content library
├── interpreters/     # Language interpreters
├── package.json      # Root workspace configuration
└── pnpm-workspace.yaml
```

## Dependency Graph

```
app → curriculum → interpreters
```

The app depends on both curriculum and interpreters packages. The curriculum depends on interpreters.

## CI/CD

This monorepo uses GitHub Actions with path-based filtering:

- **app.yml** - Runs on changes to app/, curriculum/, or interpreters/
- **curriculum.yml** - Runs on changes to curriculum/ or interpreters/
- **interpreters.yml** - Runs only on changes to interpreters/

This ensures integration tests run when dependencies change while keeping individual package tests focused.

## Contributing

Each package has its own `AGENTS.md` file with specific guidelines:

- [app/AGENTS.md](app/AGENTS.md) - Frontend application guidelines
- [curriculum/AGENTS.md](curriculum/AGENTS.md) - Curriculum package guidelines
- [interpreters/AGENTS.md](interpreters/AGENTS.md) - Interpreter package guidelines

## License

Copyright (c) 2025 Jiki Ltd. All rights reserved.
