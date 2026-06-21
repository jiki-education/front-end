---
description: Write or rewrite LLM metadata for an exercise
argument-hint: <exercise-slug>
---

# Write LLM Metadata

Write or rewrite the `llm-metadata.ts` file for the exercise specified by `$ARGUMENTS`.

## Step 1: Read Exercise Files

Read ALL of the following files for the exercise:

- `src/exercises/<slug>/metadata.json` — title, instructions, levelId
- `src/exercises/<slug>/scenarios.ts` — task IDs and scenarios
- `src/exercises/<slug>/solution.javascript` — the actual JS solution

## Step 2: Understand the Exercise

From the files you've read, determine:

1. **The learning goal** — what programming concept does this exercise allow the student to explore? (e.g., "using repeat loops to perform an action multiple times", "iterating through a string character by character"). This is the learning objective, NOT the scenario mechanics.

2. **The numbered steps** — break down what the student needs to do into concrete numbered steps. These MUST match what the actual JavaScript solution does. Read `solution.javascript` carefully and ensure every step corresponds to actual code in the solution. Use JavaScript conventions throughout.

> **Only write information Gemini would NOT already know.** The LLM (Gemini) is given the **full exercise instructions, the stub, the solution, and the taught-concepts list** directly in its prompt (see `../llm-chat-proxy/src/prompt-builder.ts`), and it can read code. For every sentence you consider writing, ask: "Given those inputs, would Gemini already know this?" If yes, do NOT write it. That rules out: the story/rules/examples (in the instructions), what the function does (instructions + solution), how to solve it (the solution), and which concepts the student knows (the concepts list). The one thing Gemini genuinely does NOT know is **how the scenarios chunk the solution into a task progression and where the student currently is** — that is what this file is for. So the description reduces to a one-line learning objective plus terse numbered steps that exist only to anchor the per-task descriptions.

## Step 3: Review Task Structure

Look at the current tasks in `scenarios.ts`. Consider whether the scenarios could be logically split into progressive tasks where:

- Task 1 is the base case (get the core algorithm working)
- Subsequent tasks add complexity (new features, edge cases, etc.)

If the exercise currently has one task but the scenarios naturally split into a progression, **restructure `scenarios.ts`** to have multiple tasks. Assign each scenario to the appropriate task. The progression should be:

- Each task builds on the previous one
- A student could get task 1 passing, then extend their code for task 2, etc.

If the scenarios genuinely don't split (they all test the same single thing with no progression), keep it as one task.

**IMPORTANT**: Order the numbered steps in the description to match the task progression. Steps for task 1 come first, then steps for task 2, etc.

## Step 4: Write llm-metadata.ts

Write `src/exercises/<slug>/llm-metadata.ts` with this exact structure:

```typescript
import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore [learning goal].

    To complete this exercise, the student needs to:
    1. [Step matching the JS solution]
    2. [Step matching the JS solution]
    ...
  `,

  tasks: {
    "first-task-id": {
      description: `
        The student needs to complete steps 1-N. Note: the student does not see these steps broken down.
      `
    },
    "second-task-id": {
      description: `
        The student has got steps 1-N working. They now need to complete steps N+1-M. Note: the student does not see these steps broken down.
      `
    }
  }
};
```

### Content Rules

- **Description paragraph 1**: "This exercise allows a student to explore [learning goal]." — Always this exact phrasing. Never "This exercise teaches".
- **Description paragraph 2**: Numbered steps. Must match the actual JS solution. Ordered by task progression.
- **Task descriptions**: State what the student has already done and what they need to do next. Include "Note: the student does not see these steps broken down."
- **NO exercise summary** — the LLM receives the full instructions; do not restate the story, rules, or what the function does.
- **NO common mistakes** — the LLM receives the solution and the student's code, it can figure this out.
- **NO teaching strategy** — the LLM should not teach.

## Step 5: Register in src/llm-metadata.ts

Check if the exercise is already registered in `src/llm-metadata.ts`. If not:

1. Add an import at the top:

   ```typescript
   import { llmMetadata as <camelCaseName>LLM } from "./exercises/<slug>/llm-metadata";
   ```

2. Add an entry to the `llmMetadataRegistry` object:
   ```typescript
   "<slug>": <camelCaseName>LLM,
   ```

## Step 6: Verify

```bash
pnpm typecheck
pnpm test
```

Both must pass. If typecheck fails due to task ID mismatches, ensure the task IDs in `llm-metadata.ts` exactly match those in `scenarios.ts`.

## Reference Example

Here is a correctly written `llm-metadata.ts` for the `isbn-verifier` exercise (3 tasks):

```typescript
import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore iterating through a string character by character,
    applying conditional logic to each character, and using a weighted sum to verify data.

    To complete this exercise, the student needs to:
    1. Iterate through each character of the ISBN string
    2. Skip dashes using continue
    3. Convert digit characters to numbers
    4. Track a running total using a multiplier counting down from 10
    5. Check if the total is divisible by 11
    6. Handle "X" only when it's the last digit (multiplier is 1), treating it as 10
    7. Return false for any invalid character
    8. After the loop, verify exactly 10 digits were processed (multiplier === 0)
  `,

  tasks: {
    "validate-basic-isbn": {
      description: `
        The student needs to complete steps 1-5. Note: the student does not see these steps broken down.
      `
    },
    "handle-x-check-digit": {
      description: `
        The student has got steps 1-5 working. They now need to complete step 6. Note: the student does not see these steps broken down.
      `
    },
    "handle-edge-cases": {
      description: `
        The student has got steps 1-6 working. They now need to complete steps 7-8. Note: the student does not see these steps broken down.
      `
    }
  }
};
```
