---
description: Migrate exercise(s) from Bootcamp to Jiki curriculum format
argument-hint: [exercise-slug]
---

# Migrate Exercise from Bootcamp to Jiki

I'll help you migrate an exercise from the Exercism Bootcamp format to the Jiki curriculum format. This command follows the comprehensive migration guide in `.context/exercise-migration.md`.

**⚠️ CRITICAL REMINDERS:**

1. Copy bootcamp `example.jiki` EXACTLY - don't rewrite it
2. Register stdlib functions in the level file
3. Register LLM metadata in `src/llm-metadata.ts`
4. Run `pnpm typecheck` before `pnpm test`
5. **JavaScript-First**: All user-facing text must use camelCase JavaScript conventions (see below)

**⚠️ JavaScript-First Conventions** (applies to all user-facing text):

- **Function names** in metadata.json instructions/hints, scenarios.ts task descriptions/hints/errorHtml, index.ts FunctionInfo, and llm-metadata.ts must be **camelCase** (e.g., `getAge()`, `turnLeft()`)
- **Code examples** in FunctionInfo `examples` must use JavaScript syntax (e.g., `let age = getAge()`)
- **No Jikiscript syntax** in user-facing text (`set ... to`, `repeat N times do ... end`, etc.) — use generic language instead
- **Exception**: `availableFunctions` names in Exercise.ts and `functionName` in IOScenario stay **snake_case** (interpreter auto-converts)

## Step 0: Read Migration Documentation

First, let me read the migration guide and language conversion reference:

```bash
cat .context/exercise-migration.md
cat .context/language-conversion.md
cat .context/exercises.md
```

## Step 1: Locate and Analyze Bootcamp Exercise

The exercise to migrate is: **$ARGUMENTS**

Let me find and analyze the bootcamp exercise:

```bash
find /Users/iHiD/Code/exercism/website/bootcamp_content -name "$ARGUMENTS" -type d
```

Once located, I'll read all the bootcamp files:

- `config.json` - Tests, tasks, metadata, stdlib functions
- `introduction.md` - Instructions and hints
- `task-*.md` - Task descriptions
- `example.jiki` - Solution code (⚠️ will copy EXACTLY)
- `stub.jiki` - Starter code

## Step 2: Identify Exercise Type and Requirements

Based on the bootcamp exercise, I'll determine:

1. **Exercise Type**: IO (return value testing) or Visual (animations)
   - Check `tests_type` in config.json

2. **Stdlib Functions**: Which functions does the solution use?
   - Check `stdlib_functions` in config.json
   - ⚠️ These MUST be added to the level file!

3. **Array Support**: Does it use arrays in args/expected?
   - If yes: Already supported via `IOValue` type

4. **Level Mapping**: What level should this be?
   - Map bootcamp level number to Jiki levelId
   - Default: "everything" for advanced exercises

## Step 3: Copy existing content

I'll create the exercise directory and then using `cp` will copy over all the relevant files from the bootcamp (including stubs, solutions and the exercise file).

Making the MINIMAL POSSIBLE CHANGES, I will then bring the files in line with the standards of this codebase.

I will then create any missing files, resulting in:

```
metadata.json Exercise.ts scenarios.ts llm-metadata.ts index.ts
solution.jiki solution.javascript solution.py
stub.jiki stub.javascript stub.py
```

I will not refactor or optimise the code, other than to bring it in line with the types and structure (e.g. VisualExercise/IOExercise, returning raw values not Jiki values, etc) of the current codebase.

I'll create each file following the migration guide:

### 4.1: metadata.json

- Extract title, description from config.json
- Convert introduction.md to instructions
- Map level to levelId
- Extract hints

### 4.2: Exercise.ts

For IO exercises, minimal class:

```typescript
import { IOExercise } from "../../Exercise";
import metadata from "./metadata.json";

export default class [Name]Exercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions = [];
}
```

### 4.3: scenarios.ts

- Convert `tasks` array to TypeScript `Task[]`
- Convert `tests` to `IOScenario[]`
- Map fields:
  - `slug` → `slug`
  - `function` → `functionName`
  - `args[]` → `args[]`
  - `checks[0].value` → `expected`
- Handle bonus tasks separately

### 4.4: solution.jiki

**⚠️ CRITICAL:** Copy bootcamp `example.jiki` EXACTLY

- Do NOT rewrite or improve
- Do NOT change variable names
- Do NOT simplify logic
- **Just copy verbatim**

### 4.5: solution.javascript

Convert from Jikiscript using `.context/language-conversion.md`:

- Function names: snake_case → camelCase
- Variable names: snake_case → camelCase
- Replace stdlib functions with native methods
- Use native array/string methods

### 4.6: solution.py

Convert from Jikiscript using `.context/language-conversion.md`:

- Keep snake_case naming
- Replace stdlib functions with native methods
- Use Python idioms (list comprehension, etc.)
- Booleans: `true` → `True`

### 4.7: stub files

Create starter code for all 3 languages with:

- Function signature
- Step-by-step comments
- Consistent structure

### 4.8: llm-metadata.ts

Run the `/write-llm-metadata` skill with the exercise slug. This will create the `llm-metadata.ts` file and register it in `src/llm-metadata.ts`.

### 4.9: index.ts

Export complete IOExerciseDefinition with:

- All imports (solutions, stubs, metadata)
- Functions documentation (stdlib functions used)
- Type: "io"

## Step 5: Critical Registrations

### 5.1: Register Stdlib Functions (if any)

⚠️ **CRITICAL** - Check `config.json` for `stdlib_functions`

If the exercise uses `push`, `sort_string`, etc., add to level file:

```bash
# For "everything" level
# Edit src/levels/everything.ts
# Add to allowedStdlibFunctions array
```

### 5.2: Register LLM Metadata

Already handled by the `/write-llm-metadata` skill in step 4.8.

### 5.3: Register Exercise

Add to `src/exercises/index.ts`:

```typescript
export const exercises = {
  // ... existing
  $ARGUMENTS: () => import("./$ARGUMENTS")
} as const;
```

## Step 6: Update README.md and PLAN.md

### 6.1: Update README.md

Add the exercise to the correct level in the curriculum JSON structure in `README.md`. Insert it in the right position within the level's `"lessons"` array.

### 6.2: Update PLAN.md

Add the exercise to the **Implemented** section of `PLAN.md` with a brief description, following the format of existing entries:

```
- `exercise-name` - Brief description (Level Name level)
```

## Step 7: Type Check and Testing

### 7.1: Type Check (Must Pass First!)

```bash
pnpm typecheck
```

If type errors, fix before proceeding to tests.

### 7.2: Run Tests

```bash
pnpm test
```

**What gets tested:**

- LLM metadata completeness
- Solution validation (all non-bonus scenarios)
- Type safety

All 80+ tests should pass, including the new exercise.

## Step 8: Quality Assurance

Before committing, ensure:

- [ ] All 9 files created
- [ ] Bootcamp solution.jiki copied exactly (not rewritten)
- [ ] Solutions work in all 3 languages
- [ ] Stdlib functions registered in level
- [ ] LLM metadata registered in registry
- [ ] Exercise registered in index.ts
- [ ] Exercise added to `README.md` curriculum JSON
- [ ] Exercise added to `PLAN.md` Implemented section
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (all tests)
- [ ] `/audit-instructions <slug>` passes (all user-facing text uses JavaScript camelCase conventions)

## Step 9: Commit and PR

If all checks pass:

1. Create feature branch
2. Commit with descriptive message
3. Push to remote
4. Create pull request

```bash
git checkout -b migrate-$ARGUMENTS
git add .
git commit -m "Migrate $ARGUMENTS exercise from Bootcamp

- Migrated from bootcamp string-puzzles/$ARGUMENTS
- Created all 9 required files (metadata, Exercise, scenarios, llm-metadata, index, solutions×3, stubs×3)
- Registered stdlib functions in level: [list them]
- Registered LLM metadata in src/llm-metadata.ts
- All tests passing (80+)

🤖 Generated with Claude Code"
git push -u origin migrate-$ARGUMENTS
gh pr create --title "Migrate $ARGUMENTS exercise" --body "$(cat <<'EOF'
## Summary

Migrated the **$ARGUMENTS** exercise from Exercism Bootcamp to Jiki curriculum format.

## Changes

### New Files
- ✅ `src/exercises/$ARGUMENTS/` - Complete exercise directory
- ✅ All 9 required files created
- ✅ Solutions for Jikiscript, JavaScript, Python
- ✅ Stubs for all 3 languages

### Registrations
- ✅ Stdlib functions added to level (if needed)
- ✅ LLM metadata registered
- ✅ Exercise registered in exercises index

### Testing
- ✅ TypeScript compilation passes
- ✅ All tests pass (80+)
- ✅ Solution validated for all scenarios

## Migration Notes

[Any special notes about this migration]

🤖 Generated with Claude Code
EOF
)"
```

## Common Issues and Solutions

### Issue: Exercise returns `undefined`

**Cause:** Stdlib functions not registered
**Fix:** Add to level's `allowedStdlibFunctions` array

### Issue: LLM metadata test fails

**Cause:** Not registered in `src/llm-metadata.ts`
**Fix:** Import and add to `llmMetadataRegistry`

### Issue: Type errors for arrays

**Cause:** Using old type definition
**Fix:** Type system already supports arrays via `IOValue` - just use them

### Issue: Solution doesn't work

**Cause:** Rewrote Jikiscript instead of copying exactly
**Fix:** Copy bootcamp `example.jiki` verbatim

Let's begin the migration!
