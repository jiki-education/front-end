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
- `instructions/en.md` — Instructions (if it exists)
- `llm-metadata.ts` — AI teaching guidance
- `solution.jiki`, `solution.javascript`, `solution.py` — Solutions
- `stub.jiki`, `stub.javascript`, `stub.py` — Starter code

Also read the base class if the exercise extends one (e.g., `DrawExercise`, `MazeExercise`, `SpaceInvadersExercise`).

---

## Step 2: Audit Checks

Run ALL of the following checks. For each check, report either PASS or FAIL with a clear explanation.

---

### Check 1: Instructions are in their own file

**Rule**: Instructions should live in `instructions/en.md`, not inline in `metadata.json`.

**PASS** if:

- `instructions/en.md` exists
- `metadata.json` does NOT have an `instructions` field

**FAIL** if instructions are still in `metadata.json` or `instructions/en.md` doesn't exist.

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

7. **Solution consistency**: Every function used in the solution files (`solution.javascript`, `solution.jiki`, `solution.py`) should have a corresponding entry in `functions`. No function should appear in the solution that isn't documented, and no documented function should be absent from the solution.

---

### Check 4: Instructions Don't Give Away the Answer

**Rule**: The instructions (in `instructions/en.md`) should explain the **goal** and **available tools**, but should NOT tell students the exact code to write or the exact algorithm/logic needed.

**What's OK in instructions**:

- Describing the goal ("Navigate the character to the target")
- Explaining the rules/constraints ("only people over 20 are allowed in")
- Providing context/story

**What's NOT OK in instructions**:

- Giving the exact sequence of function calls
- Telling students which control structures to use ("use a for loop", "use an if statement")
- Providing pseudocode that maps directly to the solution
- Specifying exact variable names or values from the solution
- Listing available functions — the functions are already shown in the exercise UI's function panel, so repeating them in the instructions is redundant

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

**Check all of the following across** `instructions/en.md`, `metadata.json` (hints), `scenarios.ts` (task names, descriptions, hints, errorHtml), `index.ts` (FunctionInfo name, signature, examples), and `llm-metadata.ts`:

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

Note: It is ok for the LLM instructions to have the answers! The LLM knows not to give away the answer, but we MUST tell the LLM the correct information it needs to guide the student.

---

### Check 7b: LLM Metadata Only Contains Information Gemini Wouldn't Already Know

**Rule**: The LLM (Gemini) already receives, in its prompt, the **full exercise instructions** (`instructions/en.md`), the **stub**, the **solution**, and the **list of taught concepts**. (See `../llm-chat-proxy/src/prompt-builder.ts` — `buildInstructionsContentSection`, `buildInitialCodeSection`, `buildTargetCodeSection`, `buildTaughtConceptsSection`.) It is also a capable model that can read code. Therefore `llm-metadata.ts` must contain **only information Gemini would NOT already know or trivially derive from those inputs**. Anything Gemini can read off the instructions, infer from the solution, or read from the concepts list is noise and should be cut.

**The test for every sentence**: "Given the instructions, the concepts list, the stub, and the solution, would Gemini already know this?" If yes → CUT. If no → KEEP.

**What Gemini already knows (so CUT it)**:

- The story, rules, examples, and constraints — these are in `instructions/en.md` verbatim.
- What the function does, its inputs/outputs/signature — stated in the instructions and visible in the solution.
- How to solve it / the algorithm — derivable from the provided solution.
- Which concepts/syntax the student knows — that is the taught-concepts list.
- Generic restatements of the goal ("students learn to compare two strings character by character") — derivable from instructions + solution.

**What Gemini does NOT know (so KEEP it)**:

- **The mapping of task IDs to portions of the solution** — i.e. "task 1 = get steps 1-3 working, task 2 adds step 4." Gemini sees the whole solution but does not know how the scenarios chunk it into a progression, or where the student currently is. This is the primary reason the file exists.
- **The numbered solution steps** only insofar as they are the anchor the task descriptions reference for that mapping. Keep them terse; do not let them balloon into a re-derivation of the solution.
- Genuinely non-obvious context: a subtlety the instructions omit, a deliberate design intent, a trap that is invisible from the instructions/solution alone.

**How to check**: Read `instructions/en.md`, the concepts for the level, and the solution. Then read `description` sentence by sentence and apply the test above. The description should reduce to roughly: a one-line learning objective + terse numbered steps that exist only to anchor the per-task progression. FAIL if any sentence restates the instructions, re-derives the solution, or repeats the concepts list — i.e. tells Gemini something it already knows.

---

### Check 8: Concept Slugs Are Present and Accurate

**Rule**: Every exercise should have a `conceptSlugs` array in its `index.ts` definition that lists the concepts the exercise teaches or practices. The slugs must correspond to actual concept directories in `src/concepts/`.

**Check each of these**:

1. **Present**: The exercise definition in `index.ts` includes a `conceptSlugs` array. If missing, this is a FAIL.

2. **Valid slugs**: Every slug in `conceptSlugs` must match a directory name under `src/concepts/`. Flag any slugs that don't correspond to an existing concept.

3. **Relevant**: The listed concepts should make sense for what the exercise actually teaches. Cross-reference with the exercise's level, instructions, and solution to verify. For example, a maze exercise at the "repeat" level should include "repeat" as a concept.

4. **Complete**: No obvious concepts should be missing. If the exercise clearly practices a concept (e.g., uses variables, requires conditionals, introduces loops) but that concept isn't listed, flag it.

---

### Check 9: Error Messages Don't Give Away Coordinates

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

### Check 10: Stubs Are Level-Appropriate and Consistent

**Rule**: Each stub (`stub.javascript`, `stub.jiki`, `stub.py`) is the student's starting point. It must only contain language constructs that have already been introduced **at or before this exercise's level**, must follow the target language's conventions, and must structurally align with the solution.

**Check each of these**:

1. **Level-appropriate constructs**: The stub must NOT use syntax or AST nodes that the exercise's level (and earlier levels) hasn't introduced yet. Cross-reference the exercise's `levelId` against the level definitions in `src/levels/` (and `.context/levels.md`) to see which features are allowed. For example, do NOT use a `for` loop in the stub if `for` loops are introduced much later — use the construct the curriculum teaches at this point (e.g. `repeat(N) { ... }`). The stub should model the expected approach, not foreshadow later syntax.

2. **JavaScript-first conventions**: `stub.javascript` must use JavaScript syntax (`repeat(60) { ... }`, `let`, `//` comments, camelCase). No Jikiscript (`repeat N times do ... end`, `set ... to`) or Python (`for i in range`, `:` blocks, `#` comments) syntax in the `.javascript` stub.

3. **Stub ↔ solution structure**: The fixed/pre-written parts of the stub (scaffolding, comments, pre-drawn elements, constant values) must match the corresponding parts of the solution. Flag drift such as a stub drawing a shape at one size while the solution uses another, or a `// TODO` that doesn't correspond to what the solution actually does there.

4. **Cross-language parity**: All three stubs should present the same scaffold and the same TODOs, differing only in language syntax. Flag a stub that is missing a section another language's stub has, or that hardcodes a different value.

**How to check**: Read all three stub files and the matching solution files. Identify the exercise's level, list the constructs the stub uses, and confirm each is allowed at that level. Then diff the stub's fixed portions against the solution.

---

### Check 11: Loop Iteration Limit Is Appropriate

**Rule**: The interpreter caps total loop iterations to prevent runaway/infinite loops. There is a **global default of 1000** (set in the JavaScript and Python executors), so most exercises need NOT set anything — they inherit it. An exercise should only add an explicit `interpreterOptions: { maxTotalLoopIterations: N }` override in its `index.ts` when it needs a bound **different** from the global default.

**When an override IS warranted**:

- **Higher than 1000**: The exercise has a legitimate solution that runs more than ~1000 total loop iterations across its scenarios (e.g. drawing/physics exercises that iterate per-pixel, or algorithmic exercises over large inputs). The limit must comfortably exceed the worst-case legitimate iteration count — including a reasonably inefficient-but-valid student solution — so no valid answer ever trips it.
- **Lower than 1000**: The exercise deliberately wants a tighter teaching bound (e.g. a small, fixed-count exercise where a large loop indicates a misunderstanding).

**Check each of these**:

1. **No override needed by default**: If the exercise's worst-case sane solution is comfortably under 1000 iterations, it should NOT set `interpreterOptions.maxTotalLoopIterations` — it correctly relies on the global default. Flagging its absence is NOT a failure.

2. **Override, when present, is sensible**: If an override IS set, verify the value against the solution and scenario inputs. FAIL if it's below the worst-case legitimate iteration count (would fail valid solutions), or if it's set to a large value with no justifying heavy solution (pointless override — prefer inheriting the global).

**Note**: We do NOT accommodate pathological approaches (e.g. a per-pixel nested loop where a single loop is the obvious solution). The bound only needs to clear a _sane_ solution, however inefficient.

---

## Step 3: Report Audit Results and Exercise Context

Present the audit results, then the full exercise context:

**Audit results** — PASS/FAIL for each check with details.

**Exercise context:**

- **Exercise**: slug, title, type (visual/io), level
- **Current instructions** (from instructions/en.md or metadata.json)
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

### Create instructions/en.md

Create `src/exercises/$ARGUMENTS/instructions/en.md` with the instructions content.

**Rules for the content:**

- Adapt from bootcamp `introduction.md` if available, otherwise write fresh
- **JavaScript-first conventions**: Use camelCase function names (e.g., `turnLeft()` not `turn_left()`)
- **No Jikiscript references**: No `set ... to`, `repeat N times`, etc.
- Use markdown formatting (headers, bullet lists, code backticks)
- Do NOT give away the solution — describe the goal and available tools
- Keep it concise and clear

### Ensure metadata.json has no instructions field

The `instructions` field should NOT be in `metadata.json` — instructions live in `instructions/en.md`. If present, remove it. Keep all other fields (`slug`, `levelId`, `hints`).

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

After the changes are made, present the instructions/en.md content to the user for review. Make any adjustments they request. Continue iterating until they're happy.
