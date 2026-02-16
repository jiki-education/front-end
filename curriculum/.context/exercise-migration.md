# Bootcamp Exercise → Jiki Exercise Migration Guide

## Overview

This guide explains how to migrate exercises from the Exercism Bootcamp format (JSON-based, single language) to the Jiki curriculum format (TypeScript-based, multi-language).

**Two Exercise Types:**

1. **IO Exercises** (`tests_type: "io"`) - Test function return values
2. **Visual Exercises** (`tests_type: "state"`) - Test visual canvas state (drawing exercises)

Check the bootcamp `config.json` field `tests_type` to determine which type you're migrating.

**Prerequisites:**

- TypeScript knowledge
- Familiarity with Jiki syntax (see `.context/language-conversion.md`)
- Understanding of both systems' structure

## ⚠️ Critical Warnings - Read First!

Before starting migration, be aware of these critical requirements that WILL cause failures if missed:

1. **Use Exact Bootcamp Solutions** - Copy `example.jiki` exactly; don't rewrite or "improve" it
2. **Register Stdlib Functions** - Add any stdlib functions to the level's `allowedStdlibFunctions` array
3. **Register LLM Metadata** - Add your exercise to `src/llm-metadata.ts` registry
4. **Array Support** - Exercises using arrays require the `IOValue` recursive type (already added)
5. **Test First** - Run `pnpm typecheck` before `pnpm test`

Details on each below in their respective sections.

## Quick Reference: Architecture Comparison

### Bootcamp Structure

```
bootcamp_content/projects/[project]/exercises/[exercise]/
├── config.json          # All metadata, tests, and configuration
├── introduction.md      # Exercise description and instructions
├── task-1.md           # Main task description
├── task-2.md           # Bonus tasks (optional)
├── example.jiki        # Solution code (Jikiscript only)
└── stub.jiki           # Starter code (Jikiscript only)
```

### Jiki Structure

```
curriculum/src/exercises/[exercise]/
├── metadata.json                # Basic metadata only
├── Exercise.ts                  # Exercise class (IOExercise)
├── scenarios.ts                 # Tasks and test scenarios
├── llm-metadata.ts             # AI assistant guidance
├── index.ts                     # Exercise definition export
├── solution.jiki                # Jikiscript solution
├── solution.javascript          # JavaScript solution
├── solution.py                  # Python solution
├── stub.jiki                   # Jikiscript starter
├── stub.javascript             # JavaScript starter
└── stub.py                     # Python starter
```

### Key Differences

| Aspect        | Bootcamp               | Jiki                                         |
| ------------- | ---------------------- | -------------------------------------------- |
| Configuration | Single `config.json`   | Distributed across multiple TypeScript files |
| Languages     | Jikiscript only        | JavaScript, Python, and Jikiscript           |
| Tests         | JSON array in config   | TypeScript `IOScenario[]`                    |
| Tasks         | JSON array in config   | TypeScript `Task[]`                          |
| Instructions  | Separate markdown file | Inline in `metadata.json`                    |
| Type safety   | None                   | Full TypeScript validation                   |
| Code files    | `.jiki` only           | `.jiki`, `.javascript`, `.py`                |

---

# Part 1: IO Exercise Migration

This section covers migrating exercises with `tests_type: "io"` - exercises that test function return values.

## Step-by-Step Migration Process

### Step 1: Analyze the Bootcamp Exercise

Before migrating, examine the bootcamp exercise structure:

1. **Read config.json** - Understand tests, tasks, and metadata
2. **Read introduction.md** - Extract instructions and hints
3. **Check task files** - Note task descriptions
4. **Review example.jiki** - Understand the solution approach
5. **Identify stdlib functions** - Note which functions are provided

**Example: Acronym Exercise**

From `config.json`:

- `title`: "Acronym"
- `level`: 5 (maps to levelId)
- `tests_type`: "io" (confirms this is an IO exercise)
- `stdlib_functions`: ["concatenate", "to_upper_case"]
- Multiple test cases with inputs and expected outputs

### Step 2: Create Directory Structure

Create the exercise directory and all required files:

```bash
cd src/exercises
mkdir acronym
cd acronym
touch metadata.json Exercise.ts scenarios.ts llm-metadata.ts index.ts
touch solution.{jiki,javascript,py} stub.{jiki,javascript,py}
```

### Step 3: Create metadata.json

Extract basic metadata from bootcamp's `config.json` and `introduction.md`.

**Bootcamp `config.json`:**

```json
{
  "title": "Acronym",
  "description": "Generate an acronym from a given phrase.",
  "level": 5
}
```

**Bootcamp `introduction.md`:**

```markdown
# Acronym

This is another classic Exercism exercise where your job is to convert
a phrase into its acronym...

[Full instructions, examples, hints]
```

**Jiki `metadata.json`:**

```json
{
  "slug": "acronym",
  "title": "Acronym",
  "instructions": "Convert a phrase to its acronym. An acronym is formed by taking the first letter of each word and converting it to uppercase. For example, 'Portable Network Graphics' becomes 'PNG'.",
  "estimatedMinutes": 10,
  "levelId": "everything",
  "hints": [
    "You can iterate through each character in the phrase",
    "Track whether the previous character was a space or hyphen",
    "Use concatenate() to build up the result string",
    "Use to_upper_case() to convert the final result to uppercase"
  ]
}
```

**Field Mapping:**

| Bootcamp                   | Jiki               | Notes                               |
| -------------------------- | ------------------ | ----------------------------------- |
| `title`                    | `title`            | Direct copy                         |
| `description`              | Discarded          | Use introduction.md content instead |
| introduction.md            | `instructions`     | Full explanation of the exercise    |
| Hints from introduction.md | `hints[]`          | Extract into array                  |
| `level`                    | `levelId`          | Map numeric level to level slug     |
| N/A                        | `estimatedMinutes` | Estimate based on complexity        |
| N/A                        | `slug`             | Create from exercise name           |

**Level Mapping:**

| Bootcamp Level | Jiki levelId                                         |
| -------------- | ---------------------------------------------------- |
| 5              | "everything" or specific level                       |
| Varies         | "fundamentals", "variables", "using-functions", etc. |

### Step 4: Create Exercise.ts

For IO exercises, create a minimal class extending `IOExercise`:

**Jiki `Exercise.ts`:**

```typescript
import { IOExercise } from "../../Exercise";
import metadata from "./metadata.json";

export default class AcronymExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (concatenate, to_upper_case)
  static availableFunctions = [];
}
```

**Notes:**

- IO exercises typically have empty `availableFunctions` (functions come from level stdlib)
- Static properties only (no instance state)
- Minimal boilerplate

### Step 5: Convert Tests to Scenarios

Extract tasks and tests from `config.json` and convert to TypeScript.

**Bootcamp `config.json` tests:**

```json
{
  "tasks": [
    {
      "name": "Basic acronyms",
      "tests": [
        {
          "slug": "png",
          "name": "Basic acronym",
          "description_html": "Generate an acronym for 'Portable Network Graphics'.",
          "function": "acronym",
          "args": ["Portable Network Graphics"],
          "checks": [{ "value": "PNG" }]
        },
        {
          "slug": "ror",
          "name": "Lowercase words",
          "description_html": "Generate an acronym for 'Ruby on Rails'.",
          "function": "acronym",
          "args": ["Ruby on Rails"],
          "checks": [{ "value": "ROR" }]
        }
      ]
    },
    {
      "name": "Bonus Tasks!",
      "bonus": true,
      "tests": [
        {
          "slug": "lowercase-only",
          "name": "How about a Baron?",
          "description_html": "Can you solve this without capital letters?",
          "function": "acronym",
          "args": ["Andrew Lloyd Webber"],
          "checks": [{ "value": "ALW" }]
        }
      ]
    }
  ]
}
```

**Jiki `scenarios.ts`:**

```typescript
import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "Create acronym function",
    description:
      "Write a function that takes a phrase and returns an acronym. The acronym should be formed by taking the first letter of each word and converting it to uppercase.",
    hints: [
      "Split the phrase into words using spaces as the delimiter",
      "Get the first character of each word",
      "Convert each character to uppercase",
      "Join the characters together"
    ],
    requiredScenarios: ["png", "ror", "first-word-only", "hyphenated"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "png",
    name: "Basic acronym: PNG",
    description: "Convert 'Portable Network Graphics' to 'PNG'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable Network Graphics"],
    expected: "PNG"
  },
  {
    slug: "ror",
    name: "Lowercase words: ROR",
    description: "Convert 'Ruby on Rails' to 'ROR'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Ruby on Rails"],
    expected: "ROR"
  },
  {
    slug: "first-word-only",
    name: "Single word: H",
    description: "Convert 'HyperText' to 'H'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["HyperText"],
    expected: "H"
  },
  {
    slug: "hyphenated",
    name: "Hyphenated phrase: CMOS",
    description: "Convert 'Complementary metal-oxide semiconductor' to 'CMOS'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Complementary metal-oxide semiconductor"],
    expected: "CMOS"
  }
];
```

**Test → Scenario Field Mapping:**

| Bootcamp Field     | Jiki Field     | Notes                              |
| ------------------ | -------------- | ---------------------------------- |
| `slug`             | `slug`         | Direct copy                        |
| `name`             | `name`         | Use as-is or make more descriptive |
| `description_html` | `description`  | Convert HTML to plain text         |
| `function`         | `functionName` | Direct copy                        |
| `args[]`           | `args[]`       | Direct copy                        |
| `checks[0].value`  | `expected`     | First check value becomes expected |
| N/A                | `taskId`       | Reference to parent task           |
| N/A                | `matcher`      | Optional, defaults to "toEqual"    |

**Task Structure:**

- **One task per exercise** for basic cases
- **Multiple tasks** if there are distinct phases (e.g., main + bonus)
- **requiredScenarios**: List scenario slugs needed to complete the task
- **bonus**: Set to `true` for bonus tasks

**Handling Bonus Tasks:**

Bootcamp bonus tasks with special checks (like "no uppercase letters") need adaptation:

❌ **Bootcamp approach (not supported in Jiki):**

```json
{
  "checks": [
    {
      "function": "numUppercaseLettersInStrings",
      "matcher": "toBe",
      "value": 0
    }
  ]
}
```

✅ **Jiki approach:**

- Create a separate bonus task
- Add the constraint to task description
- Use standard IO scenarios (can't enforce code constraints yet)
- Document in hints or instructions

### Step 6: Create Multi-Language Solutions

**⚠️ CRITICAL: Use Exact Bootcamp Jikiscript Solution**

Copy the bootcamp `example.jiki` file EXACTLY as-is. Do NOT:

- Rewrite or "improve" the logic
- Modernize syntax patterns
- Simplify helper functions
- Change variable names

**Why:** Jikiscript has specific syntax patterns (1-based array indexing `[1]`, `next` keyword, `indexed by`) that may differ from intuition. Bootcamp solutions are tested and known to work. Rewriting often introduces subtle syntax errors that cause `undefined` returns.

**Do:** Copy verbatim, then convert to JavaScript and Python.

---

Convert the Jikiscript solution to JavaScript and Python.

**Bootcamp `example.jiki`:**

```jiki
function is_letter with letter do
  for each alpha_letter in to_upper_case("abcdefghijklmnopqrstuvwxyz") do
    if to_upper_case(letter) == to_upper_case(alpha_letter) do
      return true
    end
  end
  return false
end

function acronym with sentence do
  set output to ""
  set was_space to true

  for each letter in sentence do
    if letter == " " or letter == "-" do
      change was_space to true
    else if was_space and is_letter(letter) do
      change output to concatenate(output, letter)
      change was_space to false
    end
  end

  return to_upper_case(output)
end
```

**Jiki `solution.jiki`:**

```jiki
function is_letter with letter do
  for each alpha_letter in to_upper_case("abcdefghijklmnopqrstuvwxyz") do
    if to_upper_case(letter) == to_upper_case(alpha_letter) do
      return true
    end
  end
  return false
end

function acronym with sentence do
  set output to ""
  set was_space to true

  for each letter in sentence do
    if letter == " " or letter == "-" do
      change was_space to true
    else if was_space and is_letter(letter) do
      change output to concatenate(output, letter)
      change was_space to false
    end
  end

  return to_upper_case(output)
end
```

**Jiki `solution.javascript`:**

```javascript
function isLetter(letter) {
  return /[a-zA-Z]/.test(letter);
}

function acronym(sentence) {
  let output = "";
  let wasSpace = true;

  for (const letter of sentence) {
    if (letter === " " || letter === "-") {
      wasSpace = true;
    } else if (wasSpace && isLetter(letter)) {
      output = output + letter;
      wasSpace = false;
    }
  }

  return output.toUpperCase();
}
```

**Jiki `solution.py`:**

```python
def is_letter(letter):
    return letter.isalpha()

def acronym(sentence):
    output = ""
    was_space = True

    for letter in sentence:
        if letter == " " or letter == "-":
            was_space = True
        elif was_space and is_letter(letter):
            output = output + letter
            was_space = False

    return output.upper()
```

**Key Conversions:**

1. **Function names**: `acronym` stays, but `is_letter` → `isLetter` (JS)
2. **Variable names**: `was_space` → `wasSpace` (JS)
3. **Stdlib functions**: `concatenate()` → `+`, `to_upper_case()` → `.toUpperCase()` / `.upper()`
4. **Letter checking**: Custom loop → regex (JS) or `.isalpha()` (Python)
5. **Booleans**: `true` → `True` (Python)

For detailed syntax conversion, see `.context/language-conversion.md`.

### Step 7: Create Multi-Language Stubs

Create starter code for all three languages.

**Bootcamp `stub.jiki`:**

```jiki
// TODO: Define the acronym function
```

**Jiki `stub.jiki`:**

```jiki
function acronym with phrase do
  // Your code here
  // Split the phrase into words
  // Get the first letter of each word
  // Convert to uppercase and join together
end
```

**Jiki `stub.javascript`:**

```javascript
function acronym(phrase) {
  // Your code here
  // Split the phrase into words
  // Get the first letter of each word
  // Convert to uppercase and join together
}
```

**Jiki `stub.py`:**

```python
def acronym(phrase):
    # Your code here
    # Split the phrase into words
    # Get the first letter of each word
    # Convert to uppercase and join together
    pass
```

**Stub Guidelines:**

- Include function signature
- Add helpful comments
- Use consistent naming across languages
- Keep hints minimal (detailed hints go in metadata.json)

### Step 7a: Register Stdlib Functions (If Needed)

**⚠️ CRITICAL: Stdlib Functions Must Be Registered**

If your Jikiscript solution uses stdlib functions (`push`, `sort_string`, etc.), you MUST add them to the level's `allowedStdlibFunctions` array.

**Check the bootcamp `config.json` for:**

```json
"stdlib_functions": ["push", "concatenate", "sort_string"]
```

**Then update the appropriate level file:**

For "everything" level: Edit `src/levels/everything.ts`:

```typescript
languageFeatures: {
  jikiscript: {
    languageFeatures: {
      allowedStdlibFunctions: ["concatenate", "to_upper_case", "push", "sort_string"]
      // Add any new functions here ^^^
    }
  },
```

**Symptom if forgotten:** Exercise returns `undefined` for all tests. No error messages - just undefined.

**Common stdlib functions:**

- `concatenate(str1, str2, ...)` - String concatenation
- `to_upper_case(str)` - Uppercase conversion
- `push(list, elem)` - Add to array
- `sort_string(str)` - Sort string alphabetically

---

### Step 8: Create LLM Metadata

Provide teaching guidance for AI assistants.

**Jiki `llm-metadata.ts`:**

```typescript
import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string manipulation, iteration, and character extraction.
    Students learn to process text word-by-word and build up results incrementally.
    Key concepts: string splitting, character access, string building, and case conversion.
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        Students need to iterate through the phrase, identify word boundaries (spaces/hyphens),
        extract the first character of each word, convert to uppercase, and concatenate.
        Common mistakes: forgetting to handle hyphens, not uppercasing, including spaces in output.
        Encourage using a loop with a boundary-tracking flag rather than split() since that's not available yet.
      `
    }
  }
};
```

**What to Include:**

- Exercise teaching goals
- Key concepts
- Common student mistakes
- Teaching strategies
- Level-appropriate guidance

---

### Step 8a: Register LLM Metadata

**⚠️ CRITICAL: Register in LLM Metadata Registry**

After creating `llm-metadata.ts`, you MUST register it in `src/llm-metadata.ts`:

**1. Import your metadata:**

```typescript
import { llmMetadata as acronymLLM } from "./exercises/acronym/llm-metadata";
import { llmMetadata as anagramLLM } from "./exercises/anagram/llm-metadata";
```

**2. Add to registry:**

```typescript
const llmMetadataRegistry = {
  acronym: acronymLLM,
  anagram: anagramLLM,
  "maze-solve-basic": mazeSolveBasicLLM
} as const;
```

**Symptom if forgotten:** Tests fail with `expected undefined to be defined` for LLM metadata tests.

---

### Step 9: Create index.ts

Export the complete exercise definition.

**Jiki `index.ts`:**

```typescript
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseDefinition, FunctionDoc } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionDoc[] = [
  {
    name: "concatenate(a, b)",
    description: "Combine two strings together (provided by level stdlib)",
    usage: 'concatenate("hello", "world") // returns "helloworld"'
  },
  {
    name: "to_upper_case(text)",
    description: "Convert a string to uppercase (provided by level stdlib)",
    usage: 'to_upper_case("hello") // returns "HELLO"'
  }
];

const exerciseDefinition: IOExerciseDefinition = {
  type: "io",
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
```

**Key Points:**

- Import all solution/stub files as raw text
- Document stdlib functions in `functions` array
- Use `IOExerciseDefinition` type for type safety
- Export as default

### Step 10: Register the Exercise

Add to `src/exercises/index.ts`:

```typescript
export const exercises = {
  "maze-solve-basic": () => import("./maze-solve-basic"),
  acronym: () => import("./acronym") // Add this line
  // ...
} as const;
```

## Special Cases & Edge Cases

### Handling Random/Dynamic Tests

**Bootcamp supports expressions in args:**

```json
{
  "args": ["setup.concatenate(\"Hello \", setup.randomEmoji(), \"World\")"],
  "checks": [{ "value": "HW" }]
}
```

**Jiki approach:**
❌ Dynamic expressions not supported
✅ Convert to static test cases instead

### Handling Custom Checks

**Bootcamp custom checks:**

```json
{
  "checks": [
    {
      "function": "numUppercaseLettersInStrings",
      "matcher": "toBe",
      "value": 0,
      "error_html": "You have a capital letter in your code."
    }
  ]
}
```

**Jiki approach:**
❌ Custom code checks not yet supported in IO exercises
✅ Document as bonus challenges in task description
✅ Consider future enhancement

### Handling Images

**Bootcamp:**

```json
{
  "image_slug": "string-puzzles/acronym/png.jpg"
}
```

**Jiki:**
❌ Not currently used
✅ Can be omitted

### Multiple Tasks vs. Single Task

**Bootcamp:** Often has main task + bonus task

**Jiki options:**

1. **Separate tasks** (recommended for bonus):

```typescript
export const tasks = [
  {
    id: "main-task" as const,
    bonus: false,
    requiredScenarios: ["test1", "test2"]
  },
  {
    id: "bonus-task" as const,
    bonus: true,
    requiredScenarios: ["bonus1"]
  }
] as const;
```

2. **Single task** (if bonus is just more scenarios):

```typescript
export const tasks = [
  {
    id: "main-task" as const,
    bonus: false,
    requiredScenarios: ["test1", "test2", "bonus1"]
  }
] as const;
```

## Testing & Validation

**⚠️ Test Workflow - Always Run in Order**

### Step 1: Type Check

```bash
pnpm typecheck
```

**Must pass with no errors before running tests.** Type errors will cause test failures.

### Step 2: Run Tests

```bash
pnpm test
```

**Note:** The correct command is `pnpm test`, NOT `pnpm test:curriculum` (that doesn't exist).

**What gets tested automatically:**

- **LLM Metadata Completeness** - Checks that `llm-metadata.ts` exists and is registered
- **Solution Validation** - Runs all non-bonus scenarios against Jikiscript solution
- **Type Safety** - TypeScript validates all scenarios, types, imports

**How tests discover your exercise:**

- Tests auto-discover from `src/exercises/index.ts` registry
- No manual test file creation needed
- Adding to registry = automatic test inclusion

All scenarios should pass for the Jikiscript solution. JS/Python are not automatically tested (frontend concern).

### Step 3: Manual Verification

Check each file:

- [ ] `metadata.json` - Valid JSON, all fields present
- [ ] `Exercise.ts` - Extends IOExercise correctly
- [ ] `scenarios.ts` - All scenarios reference valid taskIds
- [ ] `llm-metadata.ts` - All taskIds match scenarios
- [ ] `index.ts` - Imports all files, exports definition
- [ ] Solution files - All three languages present and working
- [ ] Stub files - All three languages present with same structure

### Step 4: Integration Test

Test in the frontend application to ensure:

- Exercise loads correctly
- All three languages work
- Scenarios execute properly
- Instructions display correctly

## Advanced Topics

### Array Support in IOScenario

**Array support is already implemented** via the recursive `IOValue` type in `src/exercises/types.ts`.

**Type definitions:**

```typescript
// Supports nested arrays
export type IOValue = string | number | boolean | null | undefined | IOValue[];

// Expected values cannot be null/undefined
export type IOExpectedValue = string | number | boolean | IOExpectedValue[];

export interface IOScenario {
  // ...
  args: Array<IOValue>; // Can include arrays, e.g., ["word", ["list", "of", "words"]]
  expected: IOExpectedValue; // Can be an array, e.g., ["result1", "result2"]
  // ...
}
```

**When you need this:**

- Exercise takes list/array as input (e.g., `find_anagrams(word, possibilities)`)
- Exercise returns list/array as output (e.g., `["match1", "match2"]`)

**Example scenario with arrays:**

```typescript
{
  slug: "two-anagrams",
  functionName: "find_anagrams",
  args: ["master", ["maters", "stream", "pigeon"]],  // String + Array
  expected: ["maters", "stream"]  // Array return value
}
```

**Comparison:** Uses `toEqual` matcher with `JSON.stringify()` for deep equality.

**No action needed** - the type system already supports this. Just use arrays in your scenarios.

---

## Common Pitfalls (Updated with Critical Issues)

### 1. Rewriting Jikiscript Solutions (NEW - CRITICAL ⚠️)

❌ Rewriting or "improving" bootcamp `example.jiki`

✅ Copy bootcamp solution EXACTLY as-is

**Why:** Subtle syntax differences cause `undefined` returns with no error messages.

### 2. Forgetting Stdlib Registration (NEW - CRITICAL ⚠️)

❌ Not adding stdlib functions to level's `allowedStdlibFunctions`

✅ Check `config.json` for stdlib_functions and add to level

**Symptom:** Exercise returns `undefined` for all tests.

### 3. Forgetting LLM Registry (NEW - CRITICAL ⚠️)

❌ Creating `llm-metadata.ts` but not registering in `src/llm-metadata.ts`

✅ Import and add to `llmMetadataRegistry`

**Symptom:** Test fails with "expected undefined to be defined" for LLM metadata.

### 4. Error Handling

When adapting bootcamp code, preserve the same error handling patterns. Use `executionCtx.logicError()` for user-facing validation errors (the same as bootcamp uses) rather than throwing plain JavaScript errors.

### 5. Forgetting Language Files

❌ Only creating `.jiki` files

✅ Create all three: `.jiki`, `.javascript`, `.py`

### 6. Inconsistent Naming

❌ Using different function names across languages

✅ Maintain consistent naming (with proper case conversion)

### 6. Missing Task References

❌ Scenarios without valid `taskId`

✅ Ensure all scenarios reference existing task ids

### 7. Wrong Exercise Type

❌ Creating VisualExercise for IO tests

✅ Use IOExercise for return value testing

### 8. Incorrect Level Mapping

❌ Using numeric level from bootcamp

✅ Map to Jiki level slug ("fundamentals", "everything", etc.)

### 9. Forgetting Registry

❌ Not adding to `src/exercises/index.ts`

✅ Always register the exercise

## Quick Migration Checklist

Use this checklist for each migration:

**Setup:**

- [ ] Create exercise directory
- [ ] Create all required files (9 files total)

**Content:**

- [ ] Create `metadata.json` from config + introduction
- [ ] Create minimal `Exercise.ts`
- [ ] Convert tests to `scenarios.ts`
- [ ] Extract hints and create tasks
- [ ] ⚠️ **COPY** bootcamp `example.jiki` EXACTLY (don't rewrite!)
- [ ] Convert Jikiscript to JavaScript solution
- [ ] Convert Jikiscript to Python solution
- [ ] Create stubs for all 3 languages
- [ ] Write `llm-metadata.ts`
- [ ] Create `index.ts` with all imports

**Critical Registrations:**

- [ ] ⚠️ Register stdlib functions in level file (if any used)
- [ ] ⚠️ Register LLM metadata in `src/llm-metadata.ts`
- [ ] ⚠️ Register exercise in `src/exercises/index.ts`

**Testing:**

- [ ] Run `pnpm typecheck` (must pass first)
- [ ] Run `pnpm test` (80+ tests including yours)
- [ ] All tests pass (especially LLM metadata and solution validation)
- [ ] Verify in frontend (optional but recommended)

## Field Reference Tables

### config.json → metadata.json

| Bootcamp Field        | Jiki Field         | Transformation                |
| --------------------- | ------------------ | ----------------------------- |
| `title`               | `title`            | Direct copy                   |
| `description`         | —                  | Discard (use introduction.md) |
| introduction.md       | `instructions`     | Full content as string        |
| `level`               | `levelId`          | Map number to level slug      |
| —                     | `slug`             | Create from exercise name     |
| —                     | `estimatedMinutes` | Estimate duration             |
| introduction.md hints | `hints[]`          | Extract into array            |

### Test → IOScenario

| Bootcamp Field     | Jiki Field     | Transformation              |
| ------------------ | -------------- | --------------------------- |
| `slug`             | `slug`         | Direct copy                 |
| `name`             | `name`         | Direct copy or enhance      |
| `description_html` | `description`  | Strip HTML                  |
| —                  | `taskId`       | Reference parent task       |
| `function`         | `functionName` | Direct copy                 |
| `args[]`           | `args[]`       | Direct copy                 |
| `checks[0].value`  | `expected`     | Extract first check value   |
| —                  | `matcher`      | Optional, default "toEqual" |

### Task Structure

| Bootcamp Field | Jiki Field          | Transformation                       |
| -------------- | ------------------- | ------------------------------------ |
| `name`         | `name`              | Direct copy                          |
| —              | `id`                | Create unique ID (lowercase, dashes) |
| —              | `description`       | Write clear description              |
| —              | `hints[]`           | Extract or create                    |
| —              | `requiredScenarios` | List scenario slugs                  |
| `bonus`        | `bonus`             | Direct copy (default false)          |

## Complete Migration Examples

### Example 1: Acronym (String-based IO Exercise)

**Migrated Jiki files:**

- `src/exercises/acronym/metadata.json`
- `src/exercises/acronym/Exercise.ts`
- `src/exercises/acronym/scenarios.ts`
- `src/exercises/acronym/llm-metadata.ts`
- `src/exercises/acronym/index.ts`
- `src/exercises/acronym/solution.{jiki,javascript,py}`
- `src/exercises/acronym/stub.{jiki,javascript,py}`

**Bootcamp source:**

- `/Users/iHiD/Code/exercism/website/bootcamp_content/projects/string-puzzles/exercises/acronym/`

**Key features:** String manipulation, stdlib functions (`concatenate`, `to_upper_case`)

### Example 2: Anagram (Array-based IO Exercise)

**Migrated Jiki files:**

- `src/exercises/anagram/metadata.json`
- `src/exercises/anagram/Exercise.ts`
- `src/exercises/anagram/scenarios.ts`
- `src/exercises/anagram/llm-metadata.ts`
- `src/exercises/anagram/index.ts`
- `src/exercises/anagram/solution.{jiki,javascript,py}`
- `src/exercises/anagram/stub.{jiki,javascript,py}`

**Bootcamp source:**

- `/Users/iHiD/Code/exercism/website/bootcamp_content/projects/string-puzzles/exercises/anagram/`

**Key features:**

- **Array inputs and outputs** - Demonstrates `IOValue` array support
- **Stdlib functions** - Uses `push`, `sort_string`, `concatenate`
- **Complex helpers** - Shows comprehensive helper function decomposition
- **Level registration** - Required adding stdlib functions to "everything" level

## Next Steps (IO Exercises)

After successful migration:

1. **Test thoroughly** with all three languages
2. **Update parent docs** if you discovered patterns worth documenting
3. **Migrate next exercise** using this guide
4. **Share learnings** if you encounter new edge cases

---

# Part 2: Visual Exercise Migration

This section covers migrating exercises with `tests_type: "state"` - exercises that test visual/game state rather than function return values.

## Visual Exercise Overview

Visual exercises test state rather than return values. They include:

- **Drawing exercises** - Extend `DrawExercise`, test shapes on a canvas (walls, houses, patterns)
- **Game exercises** - Extend custom base classes, test game state (scroll-and-shoot, mazes)
- **Animation exercises** - Test animated sequences and transitions

This section focuses on **drawing exercises** since they're the most common. For game/animation exercises, examine existing examples like `scroll-and-shoot` or `maze-solve-basic`.

**Key differences from IO exercises:**

| Aspect     | IO Exercise             | Visual Exercise                             |
| ---------- | ----------------------- | ------------------------------------------- |
| Base class | `IOExercise`            | `DrawExercise`                              |
| Test type  | Return value comparison | Shape position/size checks                  |
| Scenarios  | `IOScenario[]`          | `VisualScenario[]`                          |
| Definition | `IOExerciseDefinition`  | `VisualExerciseDefinition`                  |
| Setup      | None                    | May need background images, stroke settings |

## Visual Exercise File Structure

Same 11 files as IO exercises:

```
curriculum/src/exercises/[exercise]/
├── metadata.json                # Basic metadata
├── Exercise.ts                  # Extends DrawExercise
├── scenarios.ts                 # Tasks and VisualScenario[]
├── llm-metadata.ts             # AI assistant guidance
├── index.ts                     # VisualExerciseDefinition export
├── solution.jiki                # Jikiscript solution
├── solution.javascript          # JavaScript solution
├── solution.py                  # Python solution
├── stub.jiki                   # Jikiscript starter
├── stub.javascript             # JavaScript starter
└── stub.py                     # Python starter
```

## Step-by-Step Visual Migration

### Step 1: Identify Visual Exercise

Check bootcamp `config.json`:

```json
{
  "tests_type": "state",
  "project_type": "draw",
  "exercise_functions": ["rectangle", "circle", "triangle"]
}
```

- `tests_type: "state"` confirms visual exercise
- `exercise_functions` lists which drawing functions are needed

### Step 2: Create Exercise.ts (DrawExercise)

Visual exercises extend `DrawExercise` and select available functions:

```typescript
import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class FixWallExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    // Select only the functions needed for this exercise
    const { rectangle } = this.getAllAvailableFunctions();
    return [rectangle];
  }

  // Setup helpers for scenarios (see Step 3)
  public setupBackground(imageUrl: string) {
    this.canvas.style.backgroundImage = `url(${imageUrl})`;
    this.canvas.style.backgroundSize = "cover";
    this.canvas.style.backgroundPosition = "center";
  }

  public setupStroke(width: number, color: string) {
    this.strokeWidth = width;
    this.strokeColor = color;
  }
}

export default FixWallExercise;
```

**Available drawing functions from `getAllAvailableFunctions()`:**

- `rectangle` - Draw a rectangle (x, y, width, height, color)
- `circle` - Draw a circle (x, y, radius, color)
- `triangle` - Draw a triangle (x1, y1, x2, y2, x3, y3, color)
- `ellipse` - Draw an ellipse (x, y, rx, ry, color)
- `line` - Draw a line (x1, y1, x2, y2, color)
- `hsl_to_hex` - Convert HSL values to hex color string (h, s, l)
- `rgb_to_hex` - Convert RGB values to hex color string (r, g, b)
- `clear` - Clear canvas

**Note:** Color is passed as the final argument to each shape function (as a hex string like `"#ff0000"`). Use `hsl_to_hex` or `rgb_to_hex` to convert other color formats.

### Step 3: Handle setup_functions

Bootcamp visual exercises often have `setup_functions` in their tests:

```json
{
  "setup_functions": [
    ["changeStrokeWidth", [0.4]],
    ["strokeColorHex", ["#7f3732"]],
    ["setBackgroundImage", ["https://assets.exercism.org/bootcamp/graphics/wall.png"]]
  ]
}
```

**Convert to scenario setup():**

Since `DrawExercise` methods like `setBackgroundImage` require `ExecutionContext`, add public helper methods to your Exercise class (see Step 2), then use them in scenarios:

```typescript
export const scenarios: VisualScenario[] = [
  {
    slug: "fill-holes",
    name: "Fill the holes",
    taskId: "fill-holes",

    setup(exercise) {
      const ex = exercise as FixWallExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/wall.png");
      ex.setupStroke(0.4, "#7f3732");
    },

    expectations(exercise) {
      // ... shape checks
    }
  }
];
```

### Step 4: Convert Checks to Expectations

Bootcamp uses `getRectangleAt`, `getCircleAt`, etc. in checks:

```json
{
  "checks": [
    {
      "function": "getRectangleAt(10, 10, 20, 10)",
      "matcher": "toBeDefined",
      "error_html": "The top hole isn't filled correctly."
    }
  ]
}
```

**Convert to Jiki expectations:**

```typescript
expectations(exercise) {
  const ex = exercise as FixWallExercise;

  return [
    {
      pass: ex.hasRectangleAt(10, 10, 20, 10),
      errorHtml: "The top hole isn't filled correctly."
    },
    {
      pass: ex.hasRectangleAt(70, 30, 20, 10),
      errorHtml: "The middle hole isn't filled correctly."
    }
  ];
}
```

**Available shape check methods on DrawExercise:**

| Method                                  | Parameters        | Description            |
| --------------------------------------- | ----------------- | ---------------------- |
| `hasRectangleAt(x, y, width, height)`   | Position and size | Check rectangle exists |
| `hasCircleAt(centerX, centerY, radius)` | Center and radius | Check circle exists    |
| `hasTriangleAt(x1, y1, x2, y2, x3, y3)` | Three vertices    | Check triangle exists  |
| `hasEllipseAt(cx, cy, rx, ry)`          | Center and radii  | Check ellipse exists   |
| `hasLineAt(x1, y1, x2, y2)`             | Two endpoints     | Check line exists      |
| `numElements()`                         | None              | Count total shapes     |

### Step 5: Handle Code Checks (Optional)

Some bootcamp exercises have code quality checks:

```json
{
  "function": "assertAllArgumentsAreVariables()",
  "matcher": "toBeTrue",
  "error_html": "You should use variables for all function inputs."
}
```

**Supported code checks in Jiki:**

The interpreters provide some assertors via `InterpretResult.assertors`:

```typescript
codeChecks: [
  {
    pass: (result) => result.assertors.assertAllArgumentsAreVariables(),
    errorHtml: "All function arguments should be variables, not hard-coded values."
  }
];
```

**Not yet supported:**

- `wasFunctionCalled(name, args, count)` - Check function call count
- `numFunctionCallsInCode(name)` - Check how many times function appears in code

For unsupported checks, either skip them or document as bonus challenges.

### Step 6: Create index.ts (VisualExerciseDefinition)

```typescript
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(10, 10, 20, 10, "#AA4A44")', 'rectangle(0, 0, 100, 50, "#FF0000")'],
    category: "Drawing Shapes"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual", // NOT "io"
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
```

### Step 7: Convert Solutions

**Jikiscript:** Copy bootcamp `example.jiki` exactly.

**JavaScript:** Convert function names to camelCase, add semicolons:

- `hsl_to_hex` → `hslToHex`
- `rgb_to_hex` → `rgbToHex`
- `set x to 0` → `let x = 0;`
- `change x to x + 1` → `x = x + 1;`
- `repeat 5 times do` → `for (let i = 0; i < 5; i++) {`

**Python:** Keep snake_case, use `#` comments, no semicolons:

- `hsl_to_hex` stays as `hsl_to_hex`
- `rgb_to_hex` stays as `rgb_to_hex`
- `set x to 0` → `x = 0`
- `repeat 5 times do` → `for i in range(5):`

## Visual Exercise Examples

### Example: fix-wall (Intro exercise)

**Bootcamp:** Simple exercise using `rectangle` to fill holes with colored rectangles.

**Key features:**

- Background image setup
- Three rectangle position checks
- Minimal starter code

### Example: finish-wall (Loop exercise)

**Bootcamp:** Uses `repeat` loop to draw 5 bricks.

**Key features:**

- Loop iteration
- Multiple rectangle checks at calculated positions
- Demonstrates pattern repetition

### Example: build-wall (Nested loops)

**Bootcamp:** Uses nested loops and conditionals to draw 55 bricks.

**Key features:**

- Nested loops (rows and columns)
- Conditional logic (alternating row patterns)
- Multiple position checks sampling key locations

### Example: structured-house (Variables exercise)

**Bootcamp:** Same visual result as jumbled-house but requires variables.

**Key features:**

- Code check: `assertAllArgumentsAreVariables()`
- Variables instead of hard-coded values
- Position checks for house components

## Quick Visual Migration Checklist

**Setup:**

- [ ] Create exercise directory
- [ ] Copy bootcamp `example.jiki` and `stub.jiki`

**Exercise.ts:**

- [ ] Extend `DrawExercise`
- [ ] Select functions via `getAllAvailableFunctions()`
- [ ] Add `setupBackground()` if exercise has background image
- [ ] Add `setupStroke()` if exercise needs stroke settings

**scenarios.ts:**

- [ ] Use `VisualScenario[]` type
- [ ] Add `setup()` function if needed
- [ ] Convert `getRectangleAt` → `hasRectangleAt` in expectations
- [ ] Add `codeChecks` if exercise has code quality requirements

**index.ts:**

- [ ] Use `VisualExerciseDefinition` type
- [ ] Set `type: "visual"`
- [ ] Use `FunctionInfo[]` for functions documentation

**Registrations:**

- [ ] Register in `src/exercises/index.ts`
- [ ] Register LLM metadata in `src/llm-metadata.ts`

**Testing:**

- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
