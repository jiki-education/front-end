# Jiki Monorepo - Agent Instructions

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch using git worktree:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create an isolated worktree directory with a new branch
git worktree add ../worktrees/front-end-app-feature-branch -b feature-branch-name

# 3. Change to the worktree directory
cd ../worktrees/front-end-app-feature-branch
```

This isolates your work in a separate directory. Never work directly in the main repository directory.

Once the work is completed, always git commit, push and create a PR unless told otherwise.

---

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
