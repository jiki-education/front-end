# IO Exercises Implementation Plan

## Overview

This plan outlines the implementation of IO (Input/Output) exercises for Jiki. Unlike visual exercises that use animations and state checking, IO exercises test pure functions by calling them with arguments and comparing return values.

### Key Differences: Visual vs IO Exercises

| Aspect | Visual Exercises | IO Exercises |
|--------|-----------------|--------------|
| **Student writes** | Code that calls provided functions | Function definitions that return values |
| **Testing approach** | Execute code, check final state | Call function with args, check return value |
| **Display** | Animation view + state check | Function call + expected/actual comparison |
| **Timeline/Scrubber** | Yes (frame-based navigation) | No (single function call) |
| **Example** | `move(); turn(); move();` | `function acronym(phrase) { return ...; }` |

### Technical Approach

**Type System**: Use discriminated union with `type: 'visual' | 'io'` field:
- `VisualTestResult` - Has `view`, `animationTimeline`, `frames`
- `IOTestResult` - Has `functionName`, `args`, `expected`, `actual`, `diff`

**Exercise Classes**:
- Base `Exercise` class with common properties
- `VisualExercise extends Exercise` - Instance-based with state
- `IOExercise` - Static class (no instance needed)

**Function Calling**: Use `evaluateFunction()` method from interpreter:
```typescript
const result = interpreter.evaluateFunction(
  studentCode,
  context,
  'functionName',
  ...args
);
// Returns: { value, frames, error, meta }
```

**Value Comparison**: Use lodash `isEqual` for deep equality

**Diff Generation**: Use `diff` library for string comparison with highlighting

---

## Project 1: Interpreters (`@jiki/interpreters`)

### Goal
Add `evaluateFunction()` method to all three interpreters (jikiscript, javascript, python) to enable calling student-defined functions and getting return values.

### Research Needed
- [ ] Check if `evaluateFunction()` already exists in our interpreters
- [ ] Check if it matches the Exercism signature: `evaluateFunction(code, context, functionName, ...args)`
- [ ] Verify it returns `{ value, frames, error, meta }`

### Implementation Tasks

#### If `evaluateFunction()` doesn't exist:

**1. Jikiscript Interpreter**
- [ ] Add `evaluateFunction()` method to interpreter class
- [ ] Implementation approach (from Exercism):
  - Generate calling code: `functionName(arg1, arg2)`
  - Parse the calling code
  - Execute student code first (defines the function)
  - Evaluate the function call expression
  - Return `{ value, frames, error, meta }`
- [ ] Add tests for `evaluateFunction()`

**2. JavaScript Interpreter**
- [ ] Add `evaluateFunction()` method
- [ ] Implementation details TBD (may differ from jikiscript)
- [ ] Add tests

**3. Python Interpreter**
- [ ] Add `evaluateFunction()` method
- [ ] Implementation details TBD (may differ from jikiscript)
- [ ] Add tests

#### If `evaluateFunction()` exists:

- [ ] Verify the signature matches our needs
- [ ] Ensure it returns the function's return value in `value` field
- [ ] Add tests if missing

### Example Usage
```typescript
const result = jikiscript.evaluateFunction(
  'function add(a, b) { return a + b; }',
  { externalFunctions: [], languageFeatures: { ... } },
  'add',
  5, 3
);
// result.value === 8
```

### Dependencies
None - this is a self-contained change to the interpreters package.

---

## Project 2: Curriculum (`@jiki/curriculum`)

### Goal
Add IO exercise support infrastructure and create a sample IO exercise (e.g., "Acronym").

### Type System Changes

**1. Update Exercise.ts**
- [ ] Rename `Exercise` class to `VisualExercise`
- [ ] Create new base interface or class `Exercise` with common properties:
  - `slug: string`
  - `availableFunctions: Array<{name, func, description}>`
- [ ] Make `VisualExercise` extend/implement the base
- [ ] Create `IOExercise` as a static class:
  ```typescript
  export abstract class IOExercise {
    static slug: string;
    static availableFunctions: Array<{...}>;
  }
  ```

**2. Update exercises/types.ts**
- [ ] Add `IOScenario` type:
  ```typescript
  interface IOScenario {
    slug: string;
    name: string;
    functionName: string;
    args: any[];
    expected: any;
    matcher?: 'toBe' | 'toEqual' | 'toBeGreaterThanOrEqual' | ...;
  }
  ```
- [ ] Split `ExerciseDefinition` into discriminated union:
  ```typescript
  interface VisualExerciseDefinition {
    type: 'visual';
    ExerciseClass: new () => VisualExercise;
    scenarios: VisualScenario[];
    // ... other fields
  }

  interface IOExerciseDefinition {
    type: 'io';
    ExerciseClass: typeof IOExercise;
    scenarios: IOScenario[];
    // ... other fields
  }

  type ExerciseDefinition = VisualExerciseDefinition | IOExerciseDefinition;
  ```

**3. Update test-runner/runScenarioTest.ts**
- [ ] Add support for running IO scenarios
- [ ] Keep existing visual scenario logic
- [ ] Add branch: if exercise type is 'io', use different test execution

### Sample Exercise: Acronym

**4. Create exercises/acronym/ directory**
- [ ] `Exercise.ts` - IOExercise class definition:
  ```typescript
  export default class AcronymExercise extends IOExercise {
    static slug = 'acronym';
    static availableFunctions = [
      {
        name: 'concatenate',
        func: (ctx: ExecutionContext, a: string, b: string) => a + b,
        description: 'Combine two strings'
      },
      {
        name: 'to_upper_case',
        func: (ctx: ExecutionContext, str: string) => str.toUpperCase(),
        description: 'Convert string to uppercase'
      }
    ];
  }
  ```
- [ ] `scenarios.ts` - IO scenarios:
  ```typescript
  export const scenarios: IOScenario[] = [
    {
      slug: 'png',
      name: 'Basic acronym',
      functionName: 'acronym',
      args: ['Portable Network Graphics'],
      expected: 'PNG'
    },
    {
      slug: 'ror',
      name: 'Lowercase words',
      functionName: 'acronym',
      args: ['Ruby on Rails'],
      expected: 'ROR'
    }
  ];
  ```
- [ ] `index.ts` - Exercise definition:
  ```typescript
  const acronymExercise: IOExerciseDefinition = {
    type: 'io',
    slug: 'acronym',
    title: 'Acronym',
    instructions: 'Generate an acronym from a given phrase.',
    initialCode: 'function acronym(phrase) {\n  // Your code here\n}\n',
    ExerciseClass: AcronymExercise,
    scenarios,
    levelId: 'fundamentals',
    tasks: [],
    functions: [],
    hints: []
  };
  export default acronymExercise;
  ```
- [ ] `metadata.json` - Exercise metadata

**5. Update exercises/index.ts**
- [ ] Export the acronym exercise
- [ ] Add to exercises map

### Dependencies
- Depends on: Interpreters having `evaluateFunction()`

---

## Project 3: Frontend App (`front-end/app`)

### Goal
Update the UI and test runner to support IO exercises, including proper display of function calls and return value comparisons.

### Part A: Test Runner Changes

**1. Update test-results-types.ts**
- [ ] Split `TestResult` into discriminated union:
  ```typescript
  type TestResult = VisualTestResult | IOTestResult;

  interface VisualTestResult extends BaseTestResult {
    type: 'visual';
    expects: TestExpect[];
    frames: Frame[];
    logLines: Array<{ time: number; output: string }>;
    view: HTMLElement;
    animationTimeline: AnimationTimeline;
  }

  interface IOTestResult extends BaseTestResult {
    type: 'io';
    expects: IOTestExpect[];
    functionName: string;
    args: any[];
  }
  ```
- [ ] Add `IOTestExpect` type:
  ```typescript
  interface IOTestExpect {
    pass: boolean;
    actual: any;
    expected: any;
    diff: Change[];  // From 'diff' library
    matcher: string;
    codeRun?: string;
    errorHtml?: string;
  }
  ```

**2. Update test-runner/runTests.ts**
- [ ] Add `runIOScenario()` function:
  - Calls `interpreter.evaluateFunction()`
  - Compares actual vs expected using matcher
  - Generates diff for display
  - Returns `IOTestResult`
- [ ] Update `runTests()` to detect exercise type:
  ```typescript
  if (exercise.type === 'io') {
    return runIOTests(studentCode, exercise, language);
  } else {
    return runVisualTests(studentCode, exercise, language);
  }
  ```
- [ ] Add value comparison helper:
  ```typescript
  function compareValues(actual, expected, matcher): boolean {
    switch (matcher) {
      case 'toBe': return actual === expected;
      case 'toEqual': return isEqual(actual, expected);
      // ... other matchers
    }
  }
  ```
- [ ] Add diff generation helper:
  ```typescript
  function generateDiff(expected, actual, passed): Change[] {
    // Handle null/undefined
    // Use diffChars for strings
    // Use diffWords for booleans
    // Side-by-side for everything else
  }
  ```

**3. Add dependencies**
- [ ] `pnpm add lodash.isequal` - For deep equality comparison
- [ ] `pnpm add diff` - For string diff generation
- [ ] `pnpm add -D @types/lodash.isequal @types/diff`

### Part B: UI Component Changes

**4. Update ScenariosPanel.tsx**
- [ ] Only render Scrubber for visual tests:
  ```typescript
  {currentTest && currentTest.type === 'visual' && (
    <div className="border-t border-gray-200 px-4 py-2">
      <Scrubber />
    </div>
  )}
  ```

**5. Update InspectedTestResultView.tsx**
- [ ] Only render `view` container for visual tests
- [ ] Conditional rendering based on `currentTest.type`

**6. Update TestResultInfo.tsx**
- [ ] Branch on test result type:
  ```typescript
  if (result.type === 'visual') {
    return <StateTestResultView ... />;
  } else {
    return <IOTestResultView expect={firstExpect} />;
  }
  ```

**7. Create IOTestResultView.tsx** (new component)
- [ ] Display "Code run: functionName(args)"
- [ ] Display "Expected: value" with diff highlighting
- [ ] Display "Actual: value" with diff highlighting
- [ ] Handle diff rendering (added/removed parts)
- [ ] Style similarly to Exercism's implementation
- [ ] Example structure:
  ```tsx
  <table className="io-test-result-info">
    <tbody>
      <tr>
        <th>Code run:</th>
        <td>{expect.codeRun}</td>
      </tr>
      <tr>
        <th>Expected:</th>
        <td>{renderDiffPart(expect.diff, 'expected')}</td>
      </tr>
      <tr>
        <th>Actual:</th>
        <td>{renderDiffPart(expect.diff, 'actual')}</td>
      </tr>
    </tbody>
  </table>
  ```

**8. Add diff rendering utilities**
- [ ] Create utility to render diff parts with highlighting
- [ ] Handle newlines in strings
- [ ] Style added parts (green)
- [ ] Style removed parts (red)

**9. Update Scrubber.tsx**
- [ ] Already checks for `currentTest` - should work automatically
- [ ] May need to add check for `animationTimeline` existence

**10. Update orchestrator/store.ts**
- [ ] Ensure `currentTest` type is `TestResult | null`
- [ ] Should automatically get discriminated union support

### Part C: Type Safety & Error Handling

**11. Update type guards**
- [ ] Add type guard helper:
  ```typescript
  function isVisualTest(test: TestResult): test is VisualTestResult {
    return test.type === 'visual';
  }

  function isIOTest(test: TestResult): test is IOTestResult {
    return test.type === 'io';
  }
  ```
- [ ] Use throughout components for type narrowing

**12. Handle edge cases**
- [ ] Function doesn't exist (student didn't define it)
- [ ] Function returns undefined/null
- [ ] Function throws error
- [ ] Syntax errors in student code (existing handling should work)

### Part D: Styling

**13. Add CSS for IO test result view**
- [ ] Table styling for Expected/Actual display
- [ ] Diff highlighting (added/removed parts)
- [ ] Code run formatting
- [ ] Match existing Jiki design system

### Dependencies
- Depends on: Interpreters having `evaluateFunction()`
- Depends on: Curriculum having IO exercise types

---

## Testing Strategy

### Interpreters
- [ ] Unit tests for `evaluateFunction()` in each interpreter
- [ ] Test calling functions with various argument types
- [ ] Test return value capture
- [ ] Test error handling (function doesn't exist, etc.)

### Curriculum
- [ ] Unit tests for IOExercise class
- [ ] Test scenario execution
- [ ] Test the sample acronym exercise

### Frontend App
- [ ] Unit tests for `runIOScenario()`
- [ ] Unit tests for value comparison helpers
- [ ] Unit tests for diff generation
- [ ] Component tests for `IOTestResultView`
- [ ] Integration tests for complete IO exercise flow
- [ ] E2E test: Load acronym exercise, write solution, run tests, verify results

---

## Implementation Order

### Phase 1: Interpreters Foundation
1. Research `evaluateFunction()` in existing interpreters
2. Implement/verify `evaluateFunction()` in jikiscript interpreter
3. Add tests
4. Repeat for javascript and python interpreters

### Phase 2: Curriculum Infrastructure
1. Update Exercise type system (base class + VisualExercise + IOExercise)
2. Update scenario types
3. Create sample acronym exercise
4. Add tests

### Phase 3: Frontend - Test Runner
1. Add dependencies (lodash.isequal, diff)
2. Update test result types
3. Implement `runIOScenario()` and helpers
4. Add tests

### Phase 4: Frontend - UI
1. Create `IOTestResultView` component
2. Update `ScenariosPanel` to conditionally render scrubber
3. Update `TestResultInfo` to branch on type
4. Update `InspectedTestResultView` for conditional view rendering
5. Add styling
6. Add component tests

### Phase 5: Integration & Polish
1. E2E testing with acronym exercise
2. Fix bugs and edge cases
3. Add more IO exercises if desired
4. Update documentation

---

## Open Questions

1. **Interpreters**: Do our interpreters already have `evaluateFunction()`?
   - Need to check `@jiki/interpreters` exports
   - If not, follow Exercism's implementation pattern

2. **Matcher types**: Do we want to support all the matchers from Exercism, or start with just `toBe` and `toEqual`?
   - Start simple: `toBe`, `toEqual`
   - Add more as needed: `toBeGreaterThan`, `toBeLessThan`, `toIncludeSameMembers`, etc.

3. **Multiple checks per scenario**: Should IO scenarios support multiple checks (like visual scenarios)?
   - Exercism supports this via the `checks` array
   - For simplicity, could start with single check per scenario
   - Add multiple checks support later if needed

4. **Image support**: Should IO scenarios support images (like in Exercism config)?
   - Screenshot shows a visual next to the test results
   - Could add `imageSlug` to `IOScenario` type
   - Display image in place of animation view

5. **Custom error messages**: Should we support custom error HTML per scenario?
   - Exercism has `errorHtml` field in checks
   - Useful for providing hints: "Your acronym should be uppercase"

---

## Success Criteria

- [ ] Can define an IO exercise with function-based scenarios
- [ ] Student can write a function definition in the editor
- [ ] Clicking "Run Code" calls the function with scenario args
- [ ] UI displays "Code run", "Expected", and "Actual" values
- [ ] Diff highlighting works for string comparisons
- [ ] No scrubber/timeline shown for IO exercises
- [ ] All tests pass (unit, integration, E2E)
- [ ] Acronym exercise works end-to-end

---

## Future Enhancements

- Support for more matchers (toBeGreaterThan, etc.)
- Multiple checks per scenario
- Image display for IO exercises
- Custom error messages per scenario
- Performance optimizations
- Better diff visualization for complex objects/arrays
