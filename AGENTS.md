# Jiki Monorepo - Agent Instructions

This is a monorepo. Please read the appropriate AGENTS.md file for the project you're working on:

- **[app/AGENTS.md](app/AGENTS.md)** - Next.js frontend application
- **[curriculum/AGENTS.md](curriculum/AGENTS.md)** - Exercise content library
- **[interpreters/AGENTS.md](interpreters/AGENTS.md)** - Language interpreters

## Quick Reference

### Package Dependencies

```
app → curriculum → interpreters
```

The app depends on both curriculum and interpreters. The curriculum depends on interpreters.

### Running Tests

When making changes:
- Changes to **interpreters/** → Run interpreters, curriculum, and app tests
- Changes to **curriculum/** → Run curriculum and app tests
- Changes to **app/** → Run app tests only

### Common Commands

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test:app
pnpm test:curriculum
pnpm test:interpreters

# Development
pnpm dev:app

# Type checking
pnpm typecheck
```

For detailed instructions, see the individual AGENTS.md files linked above.
