# Jiki Monorepo - Agent Instructions

This is a monorepo. Please read the appropriate AGENTS.md file for the project you're working on:

- **[app/AGENTS.md](app/AGENTS.md)** - Next.js frontend application
- **[content/AGENTS.md](content/AGENTS.md)** - Blog posts and articles content library
- **[curriculum/AGENTS.md](curriculum/AGENTS.md)** - Exercise content library
- **[interpreters/AGENTS.md](interpreters/AGENTS.md)** - Language interpreters

## Quick Reference

### Package Dependencies

```
app → content
app → curriculum → interpreters
```

The app depends on content, curriculum, and interpreters. The curriculum depends on interpreters. The content package is standalone.

### Running Tests

When making changes:
- Changes to **interpreters/** → Run interpreters, curriculum, and app tests
- Changes to **curriculum/** → Run curriculum and app tests
- Changes to **content/** → Run content tests only
- Changes to **app/** → Run app tests only

### Common Commands

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test:app
pnpm test:content
pnpm test:curriculum
pnpm test:interpreters

# Development
pnpm dev:app

# Type checking
pnpm typecheck
```

For detailed instructions, see the individual AGENTS.md files linked above.
