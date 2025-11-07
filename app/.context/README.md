# Context Files

This directory contains documentation that provides context to AI assistants when working with the Jiki frontend codebase. These files serve as a knowledge base to help maintain consistency, understand architecture decisions, and follow established patterns.

## Purpose

Context files help AI assistants:

- Understand the codebase architecture and patterns
- Follow established coding conventions
- Make informed decisions about implementation approaches
- Maintain consistency with existing code
- Avoid common pitfalls and anti-patterns

## Directory Structure

### Root Context Files (`.context/`)

General documentation that applies across the entire codebase:

- **[about-jiki.md](./about-jiki.md)** - Overview of Jiki platform and business model
- **[architecture.md](./architecture.md)** - Frontend architecture and design decisions
- **[coding-style.md](./coding-style.md)** - Coding style and file organization guidelines
- **[commands.md](./commands.md)** - Development commands and scripts
- **[dark-light-theme-system.md](./dark-light-theme-system.md)** - Complete dark/light theme system implementation
- **[deployment.md](./deployment.md)** - Deployment process and configuration
- **[eslint.md](./eslint.md)** - ESLint configuration and how to handle lint errors
- **[git.md](./git.md)** - Git workflow and commit conventions
- **[tech-stack.md](./tech-stack.md)** - Technologies, frameworks, and dependencies
- **[testing.md](./testing.md)** - Testing setup, patterns, and guidelines
- **[toasts.md](./toasts.md)** - Toast notifications system using react-hot-toast
- **[modals.md](./modals.md)** - Global modal system with Zustand state management
- **[sound.md](./sound.md)** - Sound system for audio feedback
- **[lessons.md](./lessons.md)** - Lesson system for videos and exercises
- **[exercises.md](./exercises.md)** - Exercise system structure and creation guide
- **[content.md](./content.md)** - Content integration for blog posts and articles
- **[api.md](./api.md)** - Backend API client and usage patterns
- **[auth.md](./auth.md)** - JWT authentication system and auth flow

### Complex Exercise Context (`coding-exercise/`)

Documentation specific to the complex exercise component and its subsystems:

- **[README.md](./coding-exercise/README.md)** - Overview of how complex exercise components work together
- **[codemirror.md](./coding-exercise/codemirror.md)** - CodeMirror editor integration and extension system
- **[orchestrator-pattern.md](./coding-exercise/orchestrator-pattern.md)** - Orchestrator pattern for state management
- **[scrubber-frames.md](./coding-exercise/scrubber-frames.md)** - Frame system and timeline concepts
- **[scrubber-implementation.md](./coding-exercise/scrubber-implementation.md)** - Scrubber UI component implementation
- **[test-runner.md](./coding-exercise/test-runner.md)** - Test execution and frame generation

## How to Use These Files

### For AI Assistants

1. **Always start with [coding-style.md](./coding-style.md)** when writing new code
2. **Check relevant context files** before implementing features
3. **Follow the patterns** documented in these files
4. **Update context files** when patterns change or new decisions are made

### Loading Order Priority

When working on a task, load context files in this order:

1. **coding-style.md** - Always load first
2. **Task-specific files** - Based on what you're working on
3. **Related subsystem files** - For understanding interactions
4. **General files** - As needed for broader context

### For Complex Exercise Work

When working on complex exercise features, see:

- **[coding-exercise/README.md](./coding-exercise/README.md)** - Start here for overview
- Then load specific files based on your task

## Maintenance

### Keeping Files Current

- Context files should reflect the **current state** of the codebase
- Never use changelog format - document what IS, not what WAS
- Update immediately when patterns change
- Remove outdated information promptly

### Adding New Context Files

When adding new context documentation:

1. Place in appropriate directory (root or subdirectory)
2. Add clear title and purpose at the top
3. Include cross-references to related files
4. Update this README with the new file
5. Update AGENTS.md to reference if relevant

### Cross-References

All context files should include:

- Links to related context files
- References to relevant source code locations
- Links back to parent READMEs
- Clear navigation paths

## Best Practices

1. **Be Specific** - Use concrete examples from the codebase
2. **Stay Current** - Update documentation as code evolves
3. **Cross-Link** - Connect related documentation
4. **Be Prescriptive** - Tell what TO DO, not just what NOT to do
5. **Include Examples** - Show actual code patterns from the project

## Quick Reference

### Need to understand...

- **The product?** → [about-jiki.md](./about-jiki.md)
- **Code style?** → [coding-style.md](./coding-style.md)
- **Architecture?** → [architecture.md](./architecture.md)
- **Content (blog/articles)?** → [content.md](./content.md)
- **API integration?** → [api.md](./api.md)
- **Authentication?** → [auth.md](./auth.md)
- **Complex exercises?** → [coding-exercise/README.md](./coding-exercise/README.md)
- **Testing approach?** → [testing.md](./testing.md)
- **Deployment?** → [deployment.md](./deployment.md)

---

_For AI assistant configuration and instructions, see [../AGENTS.md](../AGENTS.md)_
