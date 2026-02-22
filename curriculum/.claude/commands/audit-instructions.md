---
description: Audit exercise instructions, hints, function docs, and LLM metadata for JavaScript-first conventions
argument-hint: <exercise-slug or "all">
---

# Audit Exercise Instructions

Audit the text content of the exercise(s) specified by `$ARGUMENTS` to ensure they follow JavaScript-first conventions. If `$ARGUMENTS` is "all", audit every exercise registered in `src/exercises/index.ts`.

## Background

We are launching with JavaScript only. All user-facing text must use JavaScript conventions (camelCase function names, JS syntax). Python and Jikiscript support will be added later.

**Important distinction**: Function names in `Exercise.ts` `availableFunctions` and `functionName` in `scenarios.ts` IOScenario remain **snake_case** (converted by `getExternalFunctions(language)` and test runners at runtime). Only _user-facing text_ must use camelCase.

The frontend displays `FunctionInfo` fields (name, signature, examples) **verbatim** — there is no auto-conversion. So these must be camelCase.

---

## Step 0: Read Exercise Files

For each exercise being audited, read:

- `metadata.json` — instructions and hints
- `scenarios.ts` — task names, descriptions, hints, errorHtml
- `index.ts` — `FunctionInfo` array (name, signature, examples)
- `llm-metadata.ts` — AI teaching guidance

---

## Audit Rules

### Rule 1: Function Names Must Be camelCase in User-Facing Text

**Applies to**: `metadata.json` (instructions, hints), `scenarios.ts` (task name, description, hints, errorHtml), `index.ts` (FunctionInfo name, signature, examples), `llm-metadata.ts`

**Check**: All function name references must use **camelCase** (JavaScript convention).

| Wrong (snake_case)   | Correct (camelCase) |
| -------------------- | ------------------- |
| `get_age()`          | `getAge()`          |
| `turn_left()`        | `turnLeft()`        |
| `is_alien_above()`   | `isAlienAbove()`    |
| `roll_to(x)`         | `rollTo(x)`         |
| `hsl(h, s, l)`       | `hsl(h, s, l)`      |
| `number_to_string()` | `numberToString()`  |

**Exceptions** (these SHOULD stay snake_case):

- `availableFunctions[].name` in `Exercise.ts` — converted by `getExternalFunctions(language)` at runtime
- `functionName` in `scenarios.ts` IOScenario — converted by test runners at runtime
- Function names inside `solution.jiki`, `stub.jiki`, `solution.py`, `stub.py` — language-specific files

Single-word function names (e.g., `move`, `shoot`, `concatenate`) are the same in both conventions — these are fine as-is.

---

### Rule 2: No Jikiscript Syntax in User-Facing Text

**Applies to**: All user-facing text fields

**Check**: No Jikiscript-specific syntax or keywords should appear.

| Jikiscript syntax (WRONG)          | Generic/JS alternative (CORRECT)                        |
| ---------------------------------- | ------------------------------------------------------- |
| `set x to value`                   | "Store the value in a variable" or show `let x = value` |
| `change x to value`                | "Update the variable"                                   |
| `repeat N times do ... end`        | "Use a loop that runs N times"                          |
| `if condition do ... end`          | "Use an if statement"                                   |
| `for each item in list do ... end` | "Loop through each item in the list"                    |
| `for each ... indexed by idx`      | "Iterate with an index"                                 |
| `else if condition do`             | "Use an else-if branch"                                 |

**Also check for**: References to "Jiki", "Jikiscript", or "Jiki language" by name. These should not appear in any user-facing text.

---

### Rule 3: No Python Syntax in User-Facing Text

**Applies to**: All user-facing text fields

**Check**: No Python-specific syntax should appear (e.g., `def`, `elif`, `True`/`False` as Python booleans, `self.`, `import`, `__init__`).

---

### Rule 4: FunctionInfo Fields Must Use camelCase JavaScript Conventions

**Applies to**: `index.ts` `functions: FunctionInfo[]` array

**Check each field**:

1. **`name`**: Must be camelCase (e.g., `"turnLeft"` not `"turn_left"`)
2. **`signature`**: Must use camelCase (e.g., `"turnLeft()"` not `"turn_left()"`)
3. **`examples`**: Must use JavaScript syntax with camelCase names:
   - Wrong: `"set age to getAge()"` (Jikiscript)
   - Wrong: `"age = get_age()"` (Python)
   - Correct: `"let age = getAge()"` (JavaScript)
4. **`description`**: Function names mentioned in descriptions must be camelCase

---

### Rule 5: Variable Names in User-Facing Text Should Be camelCase

**Applies to**: All user-facing text that references variable names

**Check**: Variable names shown to users should follow JavaScript camelCase convention.

| Wrong           | Correct        |
| --------------- | -------------- |
| `shot_length`   | `shotLength`   |
| `hue_direction` | `hueDirection` |
| `guest_name`    | `guestName`    |

---

### Rule 6: LLM Metadata Must Use JavaScript Conventions

**Applies to**: `llm-metadata.ts`

**Check**:

- No references to "Jiki", "Jikiscript", or "Jiki language"
- Function names in camelCase
- Code examples in JavaScript syntax
- Describe language behaviors generically (e.g., "string indexing starts at 1" not "string indexing starts at 1 in Jikiscript")
- Don't reference Jiki-specific constructs like `concatenate()` vs `+` — just describe the behavior in the context of the available functions

---

## Output Format

For each exercise audited, produce a report:

```
## Exercise: <slug>

### metadata.json — PASS/FAIL
[List specific violations with line references]

### scenarios.ts — PASS/FAIL
[List specific violations with line references]

### index.ts (FunctionInfo) — PASS/FAIL
[List specific violations with line references]

### llm-metadata.ts — PASS/FAIL
[List specific violations with line references]

### Overall: X/4 files passed
```

If auditing all exercises, provide a summary table:

```
## Summary

| Exercise | metadata | scenarios | index | llm-meta | Score |
|----------|----------|-----------|-------|----------|-------|
| bouncer  | FAIL     | FAIL      | FAIL  | OK       | 1/4   |
| ...      | ...      | ...       | ...   | ...      | ...   |
```
