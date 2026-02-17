---
description: Audit an exercise for correctness, quality, and adherence to curriculum standards
argument-hint: <exercise-slug>
---

# Audit Exercise

Perform a comprehensive audit of the exercise specified by `$ARGUMENTS`. If `$ARGUMENTS` is "all", audit every exercise registered in `src/exercises/index.ts`.

## Step 0: Locate Exercise Files

For each exercise being audited, read all files in `src/exercises/<slug>/`:

- `Exercise.ts` — Exercise class implementation
- `index.ts` — Exercise definition export (with `functions: FunctionInfo[]`)
- `scenarios.ts` — Tasks and test scenarios
- `metadata.json` — Slug, title, instructions, hints
- `llm-metadata.ts` — AI teaching guidance
- `solution.jiki`, `solution.javascript`, `solution.py` — Solutions
- `stub.jiki`, `stub.javascript`, `stub.py` — Starter code

Also read the base class if the exercise extends one (e.g., `DrawExercise`, `MazeExercise`, `SpaceInvadersExercise`).

---

## Audit Checks

Run ALL of the following checks. For each check, report either PASS or FAIL with a clear explanation.

---

### Check 1: No Direct DOM Manipulation in Function Methods

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

### Check 2: Function Documentation Matches Implementation

**Rule**: The `functions: FunctionInfo[]` array in `index.ts` must accurately reflect the actual available functions in `Exercise.ts`.

**Check each of these**:

1. **Completeness**: Every function in `availableFunctions` (in Exercise.ts) that students can call should have a corresponding entry in `functions` (in index.ts). No missing functions.

2. **No extras**: No functions listed in `index.ts` that don't exist in `availableFunctions`.

3. **Name accuracy**: The `name` field in FunctionInfo should match the snake_case function name in `availableFunctions`. For Jikiscript display, the `signature` field should show the correct parameter names and count.

4. **Signature accuracy**: The `signature` field should show the correct number of parameters. Cross-reference with the actual function implementation to verify parameter count and names.

5. **Description accuracy**: The `description` should accurately describe what the function does. It should not be misleading.

6. **Category consistency**: Categories should be sensible (e.g., "Information" for getters, "Action" for state-changing functions, "Movement" for position changes).

---

### Check 3: Instructions Don't Give Away the Answer

**Rule**: The `instructions` field in `metadata.json` should explain the **goal** and **available tools**, but should NOT tell students the exact code to write or the exact algorithm/logic needed.

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

### Check 4: Hints Are Progressive and Don't Give Away the Answer

**Rule**: Hints should guide students toward the solution incrementally, without giving it away. They exist in two places: `metadata.json` (exercise-level hints) and `scenarios.ts` (task-level hints in the `tasks` array).

**Check each of these**:

1. **Progressive structure**: Hints should go from general to specific. The first hint should be a gentle nudge, the last hint can be more direct but still not the full answer.

2. **No complete solutions**: No hint should contain the full solution or a directly-translatable pseudocode version of it.

3. **No exact code**: Hints should avoid giving exact code snippets that students can copy. Showing function names being called is OK (e.g., "Try using get_age()"), but showing the full logic structure is not (e.g., "set age to get_age(), then if age > 20 do open_door() end").

4. **Actually helpful**: Hints should provide genuine guidance, not be so vague as to be useless.

5. **Consistent**: Hints in `metadata.json` and task-level hints in `scenarios.ts` should not contradict each other. Both sets should be checked.

---

### Check 5: LLM Metadata Is Accurate and Up-to-Date

**Rule**: The `llm-metadata.ts` file provides guidance for AI assistants helping students. It must accurately reflect the current state of the exercise.

**Check each of these**:

1. **Description accuracy**: The `description` field should accurately describe what the exercise teaches and the key concepts involved. Cross-reference with `metadata.json` instructions and the actual Exercise class.

2. **Task coverage**: Every task ID defined in `scenarios.ts` should have a corresponding entry in the LLM metadata's `tasks` record. No missing tasks, no extra tasks.

3. **Function references**: Any functions mentioned in the LLM metadata should actually exist in the exercise's `availableFunctions`. No references to renamed or removed functions.

4. **Common mistakes accuracy**: If the LLM metadata lists common mistakes, verify they're actually possible given the exercise's implementation (e.g., if it mentions "using >= instead of >", verify that the boundary scenarios would actually catch this).

5. **Teaching strategy relevance**: The teaching guidance should be appropriate for the exercise's level (e.g., don't suggest advanced concepts for a beginner exercise).

6. **No stale information**: If the exercise has been modified since the LLM metadata was written, flag any information that may be outdated (e.g., changed function names, different scenario structure, updated instructions).

---

## Output Format

For each exercise audited, produce a report in this format:

```
## Exercise: <slug>

### Check 1: DOM Manipulation — PASS/FAIL
[Details if FAIL]

### Check 2: Function Documentation — PASS/FAIL
[Details if FAIL, listing specific mismatches]

### Check 3: Instructions — PASS/FAIL
[Details if FAIL, quoting the problematic parts]

### Check 4: Hints — PASS/FAIL
[Details if FAIL, quoting the problematic hints]

### Check 5: LLM Metadata — PASS/FAIL
[Details if FAIL, listing specific issues]

### Overall: X/5 checks passed
[Summary of issues to fix, if any]
```

If auditing all exercises, provide a summary table at the end:

```
## Summary

| Exercise | DOM | Functions | Instructions | Hints | LLM | Score |
|----------|-----|-----------|--------------|-------|-----|-------|
| bouncer  | OK  | OK        | OK           | OK    | OK  | 5/5   |
| ...      | ... | ...       | ...          | ...   | ... | ...   |
```
