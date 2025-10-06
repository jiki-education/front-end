---
description: Add a new level from .todo/levels.md to the curriculum
---

# Add Next Level from Todo List

I'll help you add the next level from `.todo/levels.md` to the curriculum. Let me start by reading the level documentation and todo file.

## Step 0: Read Context Documentation

First, let me read the level documentation to understand the structure:

```bash
cat .context/levels.md
```

## Step 1: Read the todo file

First, let me check what's the next level to implement:

```bash
cat .todo/levels.md
```

## Step 2: Planning Phase

Based on the level found in the todo file, I'll ask you some clarifying questions (if they're not covered in the todo):

1. **Language Node Types**:
   - **JavaScript**: Which AST node types should be allowed? Should it build upon the previous level's allowed nodes?
   - **Python**: Which Python AST node types should be allowed? (May be added later if interpreter support isn't ready)

2. **Feature Flags**: What language feature flags should be changed for each language?

   **JavaScript flags**:
   - `allowShadowing`: Allow variable shadowing?
   - `requireVariableInstantiation`: Require variables to be initialized?
   - `allowTruthiness`: Allow truthy/falsy checks?
   - `allowTypeCoercion`: Allow type coercion?
   - `enforceStrictEquality`: Enforce === over ==?
   - `oneStatementPerLine`: Enforce one statement per line?

   **Python flags**:
   - `allowTruthiness`: Allow truthy/falsy checks?
   - `allowTypeCoercion`: Allow type coercion?
   - Additional Python-specific flags as needed

   Feature flags build on previous levels, so we only need to specify changes.

3. **Level Structure**:
   - Should this level build incrementally on the previous level's features?
   - What's the main learning objective for this level?
   - Any specific exercises or lessons you'd like to reference (even if not implemented yet)?

4. **Description**: What description should be used for the level to explain what students will learn? Remember: This description is STUDENT-facing.

5. **Educational Goal**: What's the educational goal of this exercise. This is a reference for the educator.

## Step 3: Implementation Plan

After gathering your answers, I'll present a detailed plan showing:

1. **The new level file** that will be created at `src/syllabus/levels/[level-name].ts`
2. **The level configuration** including:
   - ID, title, description, and educational goal
   - Allowed nodes for JavaScript (and Python if applicable)
   - Feature flags for both languages
   - Empty lessons array (as requested)
3. **Syllabus integration** - how it will be added to `src/syllabus/syllabus.ts`

Once you approve the plan, I'll implement the level by:

- Creating the new level file with the agreed configuration
- Importing it in the syllabus
- Adding it to the syllabus array in the correct position
- Updating tests to reflect the new level
- Ensuring all checks pass (tests, TypeScript, linting, formatting)
- Removing the section from the levels todo
- Committing, pushing to a feature branch, and creating a PR

## Important: Before committing

I will ensure that all of the following pass:

- `pnpm run test` - All tests must pass
- `pnpm run typecheck` - No TypeScript errors
- `pnpm run lint` - No linting issues
- `pnpm run format:check` - Code is properly formatted

Let's begin by examining the todo file and determining the next level to implement.
