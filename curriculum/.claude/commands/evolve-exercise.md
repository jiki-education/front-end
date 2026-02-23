---
description: Evolve an exercise — create introduction.md, update references, review with user
argument-hint: <exercise-slug>
---

# Evolve Exercise

**This is a collaborative task. You are working WITH the user, not autonomously.** Follow the user's instructions, ask before making changes, and do not proceed to later steps without the user's go-ahead. Present information and proposals, then wait for direction. The user is the decision-maker — your job is to research, present options, and execute what they ask for.

Evolve the exercise **$ARGUMENTS** by creating proper markdown instructions, finding its bootcamp origin, and loading full context for iterative review with the user.

## Step 1: Load the exercise into context

Read ALL files for the exercise in `src/exercises/$ARGUMENTS/`:

- `metadata.json`
- `Exercise.ts`
- `scenarios.ts`
- `index.ts`
- `llm-metadata.ts`
- `solution.javascript`
- `stub.javascript`

Also read the base class if the exercise extends one (check the import in `Exercise.ts` — e.g., `MazeExercise`, `DrawExercise`, `SpaceInvadersExercise`, `IOExercise`).

## Step 2: Find the bootcamp equivalent

Search for the exercise in the bootcamp content at `/Users/iHiD/Code/exercism/website/bootcamp_content/projects/`.

The Jiki slug may differ from the bootcamp slug. Strategies to find it:

1. **Direct match**: Search for a directory matching the slug
2. **Partial match**: Search for key words from the slug across all project exercise directories
3. **By title**: Read the exercise's `metadata.json` title and search bootcamp `config.json` files for similar titles
4. **By project**: Check likely bootcamp projects based on the exercise type (e.g., maze exercises → `maze/`, string exercises → `string-puzzles/`, drawing exercises → `drawing/`)

If found, read:

- `config.json`
- `introduction.md`
- All `task-*.md` files
- `stub.jiki` and `example.jiki`

If NOT found, tell the user and note that we'll write instructions from scratch.

## Step 3: Report findings to the user

Present a summary:

- **Exercise**: slug, title, type (visual/io), level
- **Bootcamp equivalent**: Found or not. If found, show the file path (e.g., `/Users/iHiD/Code/exercism/website/bootcamp_content/projects/maze/exercises/manual-solve/`) so the user can reference it easily.
- **Current instructions** (from metadata.json)
- **Bootcamp instructions** (from introduction.md + task-\*.md, if found)
- **Current hints** (from metadata.json and scenarios.ts tasks)
- **Bootcamp hints** (from task-\*.md, if found)
- **Current task names/descriptions** (from scenarios.ts)
- **Functions** (from index.ts `FunctionInfo[]`): List each function's name, signature, description, examples, and category. These are the functions available to students in this exercise.

Then ask the user how they'd like to proceed. Do NOT make any file changes yet — wait for the user's direction.

## Step 4: Create introduction.md (when user approves)

Create `src/exercises/$ARGUMENTS/introduction.md` with the instructions content.

**Rules for the content:**

- Adapt from bootcamp `introduction.md` if available, otherwise write fresh
- **JavaScript-first conventions**: Use camelCase function names (e.g., `turnLeft()` not `turn_left()`)
- **No Jikiscript references**: No `set ... to`, `repeat N times`, etc.
- Use markdown formatting (headers, bullet lists, code backticks)
- Do NOT give away the solution — describe the goal and available tools
- Keep it concise and clear

## Step 5: Update index.ts to import introduction.md

In `src/exercises/$ARGUMENTS/index.ts`:

1. Add import: `import instructions from "./introduction.md";`
2. Add `instructions` to the exercise definition object, AFTER the `...metadata` spread so it overrides:

```typescript
const exerciseDefinition = {
  type: "...",
  ...metadata,
  instructions, // <-- overrides metadata.instructions
  ExerciseClass
  // ... rest
};
```

## Step 6: Remove instructions from metadata.json

Remove the `instructions` field from `src/exercises/$ARGUMENTS/metadata.json`. Keep all other fields (`slug`, `title`, `estimatedMinutes`, `levelId`, `hints`).

## Step 7: Verify

Run typecheck to make sure everything compiles:

```bash
pnpm typecheck
```

Then run tests:

```bash
pnpm test
```

## Step 9: Iterate with user

After the changes are made, present the introduction.md content to the user for review. Make any adjustments they request. Continue iterating until they're happy.
