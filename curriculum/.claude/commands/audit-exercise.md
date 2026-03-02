---
description: Audit an exercise and evolve it — check quality, extract instructions to markdown, review with user
argument-hint: <exercise-slug>
---

# Audit & Evolve Exercise

**This is a collaborative task. You are working WITH the user, not autonomously.** Follow the user's instructions, ask before making changes, and do not proceed to later steps without the user's go-ahead. Present information and proposals, then wait for direction. The user is the decision-maker — your job is to research, present options, and execute what they ask for.

Audit the exercise **$ARGUMENTS**, then work with the user to evolve it. If `$ARGUMENTS` is "all", audit every exercise registered in `src/exercises/index.ts` (audit checks only, no evolve steps).

## Step 1: Locate and Read Exercise Files

Read all files in `src/exercises/$ARGUMENTS/`:

- `Exercise.ts` — Exercise class implementation
- `index.ts` — Exercise definition export (with `functions: FunctionInfo[]`)
- `scenarios.ts` — Tasks and test scenarios
- `metadata.json` — Slug, title, hints
- `introduction.md` — Instructions (if it exists)
- `llm-metadata.ts` — AI teaching guidance
- `solution.jiki`, `solution.javascript`, `solution.py` — Solutions
- `stub.jiki`, `stub.javascript`, `stub.py` — Starter code

Also read the base class if the exercise extends one (e.g., `DrawExercise`, `MazeExercise`, `SpaceInvadersExercise`).

---

## Step 2: Audit Checks

Run ALL of the following checks. For each check, report either PASS or FAIL with a clear explanation.

---

### Check 1: Instructions are in their own file

**Rule**: Instructions should live in `introduction.md`, not inline in `metadata.json`. The `index.ts` should import `introduction.md` and include it in the exercise definition after the `...metadata` spread.

**PASS** if:

- `introduction.md` exists
- `index.ts` imports it and includes `instructions` in the definition
- `metadata.json` does NOT have an `instructions` field

**FAIL** if instructions are still in `metadata.json` or `introduction.md` doesn't exist.

If this check fails, skip the remaining audit checks and move directly to the **Evolve** steps below to fix it first.

---

### Check 2: No Direct DOM Manipulation in Function Methods

**Rule**: The only DOM manipulation allowed in exercise function methods is **creating new elements**. All visual changes to existing elements (moving, hiding, showing, transforming) must go through `this.animations.push()` or `this.addAnimation()`. Direct DOM manipulation (updating styles, text, classes, or removing elements) creates permanent changes that break timeline scrubbing.

**What's OK**:

- Creating elements (`document.createElement`) and appending them in function methods
- Setting initial styles on **newly created** elements (e.g., `opacity: "0"` before animating in)
- Any DOM manipulation inside `populateView()`, `createView()`, or `setup*()` methods
- Mouse event handlers (tooltip, etc.)

**What's NOT OK**:

- Changing `.style.*` on **existing** elements in function methods
- Changing `.textContent`, `.innerHTML`, `.innerText` on existing elements in function methods
- Calling `.remove()` or `.removeChild()` in function methods
- Calling `.classList.add/remove/toggle` on existing elements in function methods

**How to check**:

1. Identify all methods listed in `availableFunctions` (these run during student code execution)
2. Trace through each method and any private methods they call
3. Flag any DOM manipulation on **pre-existing** elements that isn't via the animation system

---

### Check 3: Function Documentation Matches Implementation

**Rule**: The `functions: FunctionInfo[]` array in `index.ts` must accurately reflect the actual available functions in `Exercise.ts`.

**Check each of these**:

1. **Completeness**: Every function in `availableFunctions` (in Exercise.ts) that students can call should have a corresponding entry in `functions` (in index.ts). No missing functions.

2. **No extras**: No functions listed in `index.ts` that don't exist in `availableFunctions`.

3. **Name accuracy**: The `name` field in FunctionInfo should match the snake_case function name in `availableFunctions`. For Jikiscript display, the `signature` field should show the correct parameter names and count.

4. **Signature accuracy**: The `signature` field should show the correct number of parameters. Cross-reference with the actual function implementation to verify parameter count and names.

5. **Description accuracy**: The `description` should accurately describe what the function does. It should not be misleading.

6. **Category consistency**: Categories should be sensible (e.g., "Information" for getters, "Action" for state-changing functions, "Movement" for position changes).

---

### Check 4: Instructions Don't Give Away the Answer

**Rule**: The instructions (in `introduction.md`) should explain the **goal** and **available tools**, but should NOT tell students the exact code to write or the exact algorithm/logic needed.

**What's OK in instructions**:

- Describing the goal ("Navigate the character to the target")
- Listing available functions and what they do
- Explaining the rules/constraints ("only people over 20 are allowed in")
- Providing context/story

**What's NOT OK in instructions**:

- Giving the exact sequence of function calls
- Telling students which control structures to use ("use a for loop", "use an if statement")
- Providing pseudocode that maps directly to the solution
- Specifying exact variable names or values from the solution

**How to check**: Read the instructions, then read the solution files. Could a student copy-paste or trivially translate the instructions into the solution? If yes, the instructions are too prescriptive.

---

### Check 5: Hints Are Progressive and Don't Give Away the Answer

**Rule**: Hints should guide students toward the solution incrementally, without giving it away. They exist in two places: `metadata.json` (exercise-level hints) and `scenarios.ts` (task-level hints in the `tasks` array).

**Check each of these**:

1. **Progressive structure**: Hints should go from general to specific. The first hint should be a gentle nudge, the last hint can be more direct but still not the full answer.

2. **No complete solutions**: No hint should contain the full solution or a directly-translatable pseudocode version of it.

3. **No exact code**: Hints should avoid giving exact code snippets that students can copy. Showing function names being called is OK (e.g., "Try using get_age()"), but showing the full logic structure is not (e.g., "set age to get_age(), then if age > 20 do open_door() end").

4. **Actually helpful**: Hints should provide genuine guidance, not be so vague as to be useless.

5. **Consistent**: Hints in `metadata.json` and task-level hints in `scenarios.ts` should not contradict each other. Both sets should be checked.

---

### Check 6: JavaScript-First Conventions

**Rule**: All user-facing text must use JavaScript conventions. We are launching with JavaScript only — Python and Jikiscript support will be added later.

**Important distinction**: Function names in `Exercise.ts` `availableFunctions` and `functionName` in `scenarios.ts` IOScenario remain **snake_case** (converted at runtime). Only _user-facing text_ must use camelCase.

**Check all of the following across** `introduction.md`, `metadata.json` (hints), `scenarios.ts` (task names, descriptions, hints, errorHtml), `index.ts` (FunctionInfo name, signature, examples), and `llm-metadata.ts`:

1. **Function names are camelCase**: e.g., `getAge()` not `get_age()`, `turnLeft()` not `turn_left()`. Single-word names (`move`, `shoot`) are fine as-is.

2. **Variable names are camelCase**: e.g., `shotLength` not `shot_length`, `guestName` not `guest_name`.

3. **No Jikiscript syntax**: No `set x to value`, `change x to value`, `repeat N times do ... end`, `if condition do ... end`, `for each ... indexed by`. No references to "Jiki", "Jikiscript", or "Jiki language".

4. **No Python syntax**: No `def`, `elif`, `True`/`False` as Python booleans, `self.`, `import`, `__init__`.

5. **FunctionInfo fields**: `name` must be camelCase, `signature` must use camelCase, `examples` must use JavaScript syntax (e.g., `let age = getAge()` not `set age to get_age()`).

6. **LLM metadata**: No references to "Jiki"/"Jikiscript", function names in camelCase, code examples in JS syntax, generic language descriptions.

---

### Check 7: LLM Metadata Is Accurate and Up-to-Date

**Rule**: The `llm-metadata.ts` file provides guidance for AI assistants helping students. It must accurately reflect the current state of the exercise.

**Check each of these**:

1. **Description accuracy**: The `description` field should accurately describe what the exercise teaches and the key concepts involved. Cross-reference with the instructions and the actual Exercise class.

2. **Task coverage**: Every task ID defined in `scenarios.ts` should have a corresponding entry in the LLM metadata's `tasks` record. No missing tasks, no extra tasks.

3. **Function references**: Any functions mentioned in the LLM metadata should actually exist in the exercise's `availableFunctions`. No references to renamed or removed functions.

4. **Common mistakes accuracy**: If the LLM metadata lists common mistakes, verify they're actually possible given the exercise's implementation (e.g., if it mentions "using >= instead of >", verify that the boundary scenarios would actually catch this).

5. **Teaching strategy relevance**: The teaching guidance should be appropriate for the exercise's level (e.g., don't suggest advanced concepts for a beginner exercise).

6. **No stale information**: If the exercise has been modified since the LLM metadata was written, flag any information that may be outdated (e.g., changed function names, different scenario structure, updated instructions).

---

### Check 8: Error Messages Don't Give Away Coordinates

**Rule**: The `errorHtml` messages in scenario expectations should NOT include exact coordinates, positions, sizes, or other values that would give away the answer. They should tell the student _which part_ is wrong, but not _what the correct values are_.

**What's OK**:

- "The left cheek triangle isn't right."
- "The base (bottom) circle isn't right."
- "The top hole isn't filled correctly."

**What's NOT OK**:

- "The base circle should be centered at (50, 70) with a radius of 20."
- "The left ear triangle should have corners at (10,40), (10,5), and (50,40)."
- "Expected a rectangle at position (10, 10) with width 20 and height 10."

**How to check**: Read all `errorHtml` strings in `scenarios.ts`. Flag any that contain specific numeric coordinates, sizes, or positions from the solution.

---

## Step 3: Report Audit Results and Exercise Context

Present the audit results, then the full exercise context:

**Audit results** — PASS/FAIL for each check with details.

**Exercise context:**

- **Exercise**: slug, title, type (visual/io), level
- **Current instructions** (from introduction.md or metadata.json)
- **Current hints** (from metadata.json and scenarios.ts tasks)
- **Current task names/descriptions** (from scenarios.ts)
- **Functions** (from index.ts `FunctionInfo[]`): List each function's name, signature, description, examples, and category.

**Bootcamp equivalent:**

Search for the exercise in the bootcamp content at `/Users/iHiD/Code/exercism/website/bootcamp_content/projects/`.

The Jiki slug may differ from the bootcamp slug. Strategies to find it:

1. **Direct match**: Search for a directory matching the slug
2. **Partial match**: Search for key words from the slug across all project exercise directories
3. **By title**: Read the exercise's `metadata.json` title and search bootcamp `config.json` files for similar titles
4. **By project**: Check likely bootcamp projects based on the exercise type (e.g., maze exercises → `maze/`, string exercises → `string-puzzles/`, drawing exercises → `drawing/`)

If found, read `config.json`, `introduction.md`, all `task-*.md` files, `stub.jiki` and `example.jiki`. Show the file path and the bootcamp instructions/hints content.

If NOT found, tell the user and note that instructions will need to be written from scratch.

Then ask the user how they'd like to proceed. Do NOT make any file changes yet — wait for the user's direction.

---

## Evolve Steps (when user approves)

### Create introduction.md

Create `src/exercises/$ARGUMENTS/introduction.md` with the instructions content.

**Rules for the content:**

- Adapt from bootcamp `introduction.md` if available, otherwise write fresh
- **JavaScript-first conventions**: Use camelCase function names (e.g., `turnLeft()` not `turn_left()`)
- **No Jikiscript references**: No `set ... to`, `repeat N times`, etc.
- Use markdown formatting (headers, bullet lists, code backticks)
- Do NOT give away the solution — describe the goal and available tools
- Keep it concise and clear

### Update index.ts to import introduction.md

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

### Remove instructions from metadata.json

Remove the `instructions` field from `src/exercises/$ARGUMENTS/metadata.json`. Keep all other fields (`slug`, `title`, `estimatedMinutes`, `levelId`, `hints`).

### Verify

Run typecheck to make sure everything compiles:

```bash
pnpm typecheck
```

Then run tests:

```bash
pnpm test
```

### Iterate with user

After the changes are made, present the introduction.md content to the user for review. Make any adjustments they request. Continue iterating until they're happy.
