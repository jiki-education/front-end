---
description: Add a new exercise from .todo/exercises.md to the curriculum
---

# Add Next Exercise from Todo List

I'll help you add the next exercise from `.todo/exercises.md` to the curriculum. Let me start by reading the exercise documentation and todo file.

## Step 0: Read Context Documentation

First, let me read the exercise documentation to understand the patterns:

```bash
cat .context/exercises.md
```

## Step 1: Read the todo file

First, let me check what's the next exercise to implement:

```bash
cat .todo/exercises.md
```

## Step 2: Planning Phase

Based on the exercise found in the todo file, I'll ask you some clarifying questions (if they're not covered in the todo):

1. **Exercise Mechanics**:
   - What is the underlying game/puzzle?
   - What should the player/character be able to do? (e.g., move, jump, rotate, etc.)
   - What visual elements should be displayed on screen?
   - How should the exercise respond to each available function?
   - Remember: Each exercise defines its own unique functions

2. **Available Functions**:
   - What exercise-specific functions should be exposed to the learner?
   - What should each function do (visually and in state)?
   - Should functions have parameters? If so, what type and range?
   - Any timing/duration for animations?
   - Note: Use snake_case naming (JavaScript conversion is automatic)

3. **State Management**:
   - What state properties need to be tracked? (e.g., position, rotation, score)
   - What are the initial values for each state property?
   - Are there any constraints or limits? (e.g., boundaries, max values)

4. **Visual Design**:
   - What should the exercise container look like?
   - What CSS styles and layout should be used?
   - Should there be any background, grid, or reference markers?
   - What colors/themes align with the exercise concept?

5. **Scenarios** (test cases):
   - What different starting states should we test?
   - What success conditions vary between scenarios?
   - Remember: Scenarios are like test cases - same functions, different states
   - How do scenarios progressively increase difficulty?

6. **Learning Objectives**:
   - What programming concept does this exercise teach?
   - How does it fit into the current curriculum progression?
   - What skills should learners gain from completing this exercise?

## Step 3: Implementation Plan

After gathering your answers, I'll present a detailed plan showing:

1. **Exercise folder structure** at `src/exercises/[exercise-name]/`:
   - `Exercise.ts` - Main exercise class implementation
   - `scenarios.ts` - Different scenarios/difficulty levels (if needed)
   - `index.ts` - Module exports

2. **Exercise class design** including:
   - State properties and their initial values
   - Exercise-specific available functions (in snake_case) with descriptions
   - Animation logic for each function
   - View generation with HTML/CSS
   - Support for both JavaScript (auto-converted) and Python naming

3. **Integration points**:
   - Export from `src/exercises/index.ts`
   - Type definitions if needed
   - How it connects to levels/lessons

## Step 4: Implementation

Once you approve the plan, I'll implement the exercise by:

1. Creating the exercise folder and files
2. Implementing the Exercise class with:
   - State management
   - Available functions
   - Animation generation
   - View population
3. Adding scenarios if applicable
4. Exporting from the exercises index
5. Running tests to ensure everything works

## Step 5: Testing

After implementation, I'll:

- Build the package to check for TypeScript errors
- Run any existing tests
- Verify the exercise structure matches existing patterns
- Ensure state work correctly by adding tests, and checking the correct animations are generated for different scenarios/code intersections (but not by checking the animations actually work)

## Step 6: Quality Assurance & Commit

Before committing, I'll ensure all of the following pass:

- `pnpm run test` - All tests must pass
- `pnpm run typecheck` - No TypeScript errors
- `pnpm run lint` - No linting issues
- `pnpm run format:check` - Code is properly formatted

After all checks pass:

- Remove the section from the exercises todo
- Commit, push to a feature branch, and create a PR

Let's begin by examining the todo file and determining the next exercise to implement.
