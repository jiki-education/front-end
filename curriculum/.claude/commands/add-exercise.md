---
description: Add a new exercise to the curriculum
argument-hint: [description of exercise to add, or path to reference material]
---

# Add New Exercise

I'll help you add a new exercise to the Jiki curriculum. The user will provide context about what exercise to create via `$ARGUMENTS`.

## Step 0: Read Context Documentation

Read the exercise documentation, language conversion guide, and animation system:

```bash
cat .context/exercises.md
cat .context/language-conversion.md
cat .context/animations.md
```

## Step 1: Understand the Request

Read and analyze whatever the user provided in `$ARGUMENTS` (e.g., a reference file path, a description of the exercise concept, a link to existing material).

## Step 2: Explore Existing Base Classes

Read ALL exercise category base classes to understand what's already built:

- `src/exercise-categories/maze/MazeExercise.ts` — Grid-based navigation with move/turn functions
- `src/exercise-categories/space-invaders/SpaceInvadersExercise.ts` — Laser movement, alien grid, shooting mechanics
- `src/exercise-categories/draw/DrawExercise.ts` — Canvas drawing with shapes (rectangle, circle, line, etc.), colors (hex, RGB, HSL), and stroke control
- `src/VisualExercise.ts` — Base for custom visual exercises (extend directly when no category fits)
- `src/IOExercise.ts` — Base for input/output function-testing exercises (no visuals)

Also look at a few existing exercises that seem similar to what's being requested, to understand patterns:

- For drawing exercises, see how they cherry-pick functions: e.g., `src/exercises/rainbow/Exercise.ts` uses `getAllAvailableFunctions()` to select only the functions needed
- For maze exercises, see `src/exercises/maze-solve-basic/` for a minimal extension
- For space invaders, see `src/exercises/scroll-and-shoot/` for scenario-driven configuration
- For IO exercises, see `src/exercises/two-fer/` or `src/exercises/anagram/`

## Step 3: Discussion with User

**STOP and have a conversation with the user before implementing anything.** Use AskUserQuestion or just ask directly. Cover:

1. **Base Class Selection**: Based on your exploration, present:
   - Which existing base class(es) could work and why
   - What the base class already provides (functions, state, view)
   - What would need to be added/overridden vs what comes for free
   - Whether a new base class or direct VisualExercise extension is needed

2. **Exercise Type**: Visual or IO?

3. **Available Functions**: What functions should the learner have access to?
   - Which are already provided by the base class?
   - Which need to be added or restricted?
   - For draw exercises: which functions from `getAllAvailableFunctions()` to expose?

4. **Scenarios and Tasks**:
   - What are the different test cases / difficulty levels?
   - What are the success conditions?
   - Any bonus challenges?

5. **Level Assignment**: Which `levelId` should this exercise use?

6. **Stdlib Functions**: Does the exercise need any stdlib functions (e.g., `concatenate`, `push`, `sort_string`)? If so, verify they're registered in the appropriate level file.

Wait for the user's responses before proceeding.

## Step 4: Implementation

Once the user approves the approach, create ALL required files:

### Required Files (11 total)

```
src/exercises/[exercise-name]/
├── metadata.json         # slug, title, instructions, estimatedMinutes, levelId, hints
├── Exercise.ts           # Exercise class (extends appropriate base)
├── scenarios.ts          # Tasks and test scenarios
├── llm-metadata.ts       # AI teaching guidance
├── index.ts              # Exercise definition export
├── solution.jiki         # Jikiscript solution
├── solution.javascript   # JavaScript solution (camelCase naming)
├── solution.py           # Python solution (snake_case naming)
├── stub.jiki             # Jikiscript starter code
├── stub.javascript       # JavaScript starter code
└── stub.py               # Python starter code
```

### Language Conversion Rules

When creating solutions and stubs in 3 languages, follow `.context/language-conversion.md`:

- **Jikiscript → JavaScript**: snake_case → camelCase, Jiki keywords → JS syntax
- **Jikiscript → Python**: Keep snake_case, adapt to Python syntax (True/False, indentation, etc.)
- **Stdlib functions** become native methods in JS/Python (e.g., `concatenate()` → `+` or `.join()`)

### Exercise Class Patterns

**Extending a category base (e.g., Draw):**

```typescript
import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export default class MyExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle } = this.getAllAvailableFunctions();
    return [rectangle, circle];
  }
}
```

**Extending a category base (e.g., Maze, SpaceInvaders) — minimal override:**

```typescript
import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import metadata from "./metadata.json";

export default class MyExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }
}
```

**IO Exercise — minimal:**

```typescript
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class MyExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions = [];
}
```

**Custom Visual Exercise — direct extension:**

```typescript
import { VisualExercise } from "../../VisualExercise";
import type { ExecutionContext } from "@jiki/interpreters";
import metadata from "./metadata.json";

export default class MyExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }
  // ... custom state, functions, view, animations
}
```

## Step 5: Critical Registrations

### 5.1: Register Exercise in `src/exercises/index.ts`

```typescript
"exercise-name": () => import("./exercise-name"),
```

### 5.2: Register LLM Metadata in `src/llm-metadata.ts`

1. Add import: `import { llmMetadata as exerciseNameLLM } from "./exercises/exercise-name/llm-metadata";`
2. Add to registry: `"exercise-name": exerciseNameLLM,`

### 5.3: Register Stdlib Functions (if needed)

If the exercise uses stdlib functions (check solution.jiki for calls like `concatenate()`, `push()`, `sort_string()`, etc.), ensure they're in the appropriate level's `allowedStdlibFunctions` array (e.g., `src/levels/everything.ts`).

## Step 6: Update README.md and PLAN.md

### 6.1: Update README.md

Add the exercise to the correct level in the curriculum JSON structure in `README.md`. Insert it in the right position within the level's `"lessons"` array.

### 6.2: Update PLAN.md

Add the exercise to the **Implemented** section of `PLAN.md` with a brief description, following the format of existing entries:

```
- `exercise-name` - Brief description (Level Name level)
```

## Step 7: Type Check and Testing

### 7.1: Type Check First

```bash
pnpm typecheck
```

Fix any type errors before running tests.

### 7.2: Run Tests

```bash
pnpm test
```

All tests must pass, including automatic tests for the new exercise (LLM metadata, solution validation).

## Step 8: Quality Assurance

Before committing, verify:

- [ ] All 11 files created in exercise directory
- [ ] Solutions work in all 3 languages (Jikiscript, JavaScript, Python)
- [ ] Stubs provide helpful starting points in all 3 languages
- [ ] Exercise registered in `src/exercises/index.ts`
- [ ] LLM metadata registered in `src/llm-metadata.ts`
- [ ] Stdlib functions registered in level file (if applicable)
- [ ] Exercise added to `README.md` curriculum JSON
- [ ] Exercise added to `PLAN.md` Implemented section
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (all tests)
- [ ] `pnpm lint` passes
- [ ] `pnpm format:check` passes

## Step 9: Commit and PR

```bash
git add .
git commit -m "Add [exercise-name] exercise

- Created all 11 required files
- [Brief description of what the exercise teaches]
- All tests passing

Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin add-[exercise-name]
gh pr create --title "Add [exercise-name] exercise" --body "$(cat <<'EOF'
## Summary

Added the **[exercise-name]** exercise to the Jiki curriculum.

## Details

- **Type**: [Visual/IO]
- **Base class**: [which base class it extends]
- **Level**: [levelId]
- **Concepts taught**: [what it teaches]

## Files Created

- All 11 required exercise files
- Registered in exercise index, LLM metadata registry[, and stdlib if applicable]

## Testing

- TypeScript compilation passes
- All tests pass
- Solutions validated for all scenarios

🤖 Generated with Claude Code
EOF
)"
```

## Common Issues

### Exercise returns `undefined` for all tests

**Cause:** Stdlib functions not registered in level file
**Fix:** Add to the level's `allowedStdlibFunctions` array

### LLM metadata test fails with "expected undefined to be defined"

**Cause:** Not registered in `src/llm-metadata.ts`
**Fix:** Import and add to `llmMetadataRegistry`

### Type errors in scenarios.ts

**Cause:** Scenario type doesn't match exercise type (Visual vs IO)
**Fix:** Use `VisualScenario[]` for visual exercises, `IOScenario[]` for IO exercises

### CSS not loading for visual exercise

**Cause:** Missing CSS import in index.ts
**Fix:** Add `import "../../exercise-categories/[category]/exercise.css";` at top of index.ts
