# Test Runner System

## Navigation

- **Parent**: [Complex Exercise README](./README.md)
- **Related**:
  - [Scrubber Frames](./scrubber-frames.md) - Frame generation output
  - [Orchestrator Pattern](./orchestrator-pattern.md) - State management
  - [CodeMirror Integration](./codemirror.md) - Code execution source
- **Context Root**: [.context/README.md](../README.md)

## Overview

The test runner system executes student code against predefined tests, generating frames and animations that can be navigated via the scrubber.

## Architecture

### Components

1. **TestSuiteManager** (`orchestrator/TestSuiteManager.ts`)
   - Manages test execution lifecycle
   - Handles test suite result storage
   - Integrates with orchestrator state
   - Provides methods for running and clearing tests

2. **Test Suite Generation** (`generateAndRunTestSuite.ts`)
   - Entry point for test execution
   - Iterates through tasks and their tests
   - Returns `TestSuiteResult` with all test results

3. **Individual Test Execution** (`execTest.ts`)
   - Core test execution logic
   - Handles both JavaScript and Jikiscript languages
   - Creates exercise instances when needed
   - Returns comprehensive test results

4. **Test Result Structure**
   ```typescript
   {
     expects: Expect[]           // Assertions
     slug: string                // Test identifier
     codeRun: string            // Display string (e.g., "fibonacci(5)")
     frames: Frame[]            // Execution frames
     type: 'state' | 'io'       // Test type
     animationTimeline: AnimationTimeline
     imageSlug?: string
     view?: any                 // Exercise visualization
     logMessages: any[]
   }
   ```

## Key Components

### Exercise Integration

- Exercises are TypeScript classes (e.g., `MazeExercise`)
- Provide:
  - `availableFunctions`: Functions exposed to student code
  - `availableClasses`: Classes exposed to student code
  - `animations`: Array of animations triggered during execution
  - `getView()`: Returns visual representation

### Frame Generation

- **Jikiscript**: Interpreter generates frames during execution
  - One frame per expression parsed
  - Each frame has time in microseconds and timeInMs in milliseconds
  - Contains status (SUCCESS/ERROR) and execution details

- **JavaScript**: External execution with error handling
  - No frame-by-frame execution
  - Error reporting with line information

### Animation Timeline Building

```typescript
buildAnimationTimeline(exercise, frames) {
  // Three cases:
  // 1. Exercise with animations: Use exercise.animations
  // 2. Successful exercise without animations: Create placeholder
  // 3. Infinite loop errors: Skip animations if configured

  return new AnimationTimeline({}, frames)
    .populateTimeline(animations, placeholder)
}
```

### External Function Context

When exercise functions are called during interpretation:

1. Function receives current frame time as context
2. Function schedules animations at that time
3. Animations are collected in `exercise.animations` array

Example:

```javascript
// In MazeExercise
turnLeft(context) {
  this.animations.push({
    targets: '.maze-character',
    rotate: '-90deg',
    duration: 100,
    offset: context.time  // Frame time when called
  })
}
```

## Setup Functions

Tests can specify `setupFunctions` to initialize exercise state:

```typescript
setupFunctions: [
  ["setMazeSize", [5, 5]],
  ["placeCharacterAt", [0, 0]]
];
```

## Error Handling

- Parse errors: No frames generated, special handling required
- Runtime errors: Error frame created with details
- Infinite loops: Detected and limited by interpreter
- Logic errors: Thrown via `globalThis.logicError()`

## Test Types

- **I/O Tests**: Simple input/output validation
- **State Tests**: Validate exercise state after execution
  - Used when exercise instance exists
  - Can check internal state, animations, etc.

## Language Support

### Jikiscript

- Custom interpreted language
- Full frame-by-frame execution
- Complete timing control

### JavaScript

- External execution via `execJS`
- Limited frame information
- Error mapping to source lines

## Integration with Scrubber

The test runner provides:

- `frames`: Array of execution frames with timing (Frame type from interpreters package)
  - `time`: Microseconds for scrubber precision
  - `timeInMs`: Milliseconds for animation compatibility
- `animationTimeline`: Timeline synchronized with frames
- Uses TIME_SCALE_FACTOR (1000) imported from interpreters package

This enables the scrubber to:

- Navigate through code execution with microsecond precision
- Sync visual animations using millisecond timings
- Show frame information at each step

## TestSuiteManager Integration

The TestSuiteManager orchestrates test execution:

1. **Running Tests**: Calls test runner functions and stores results
2. **State Management**: Updates orchestrator state with test results
3. **Result Caching**: Maintains test suite results for reuse
4. **Clearing Tests**: Resets test state when code changes

## Hidden Progression Tests

Visual exercises can define an optional `progressionTest` (see `ProgressionTest` / `ProgressionMetric` in `@jiki/curriculum`): a hidden, per-run measure of how close the student is to a working solution. It is never shown to the student and never affects the visible test results.

- **Runner**: `runProgressionTest.ts` executes the student's code once against a fresh exercise instance with the progression test's setup. No animation timeline, view, or frames are produced.
- **Scoring**: Each metric's `score` function returns a value in its natural units, clamped to `0..maxScore`, then converted to integer points weighted by the metric's `points`. Score functions run in their own try/catch (a throw scores 0). Syntax/compile errors score all metrics 0. Runtime errors still evaluate metrics against the halted exercise state (partial progress is the signal).
- **Wiring**: `TestSuiteManager.runCode` scores the progression test alongside each run (including syntax-error runs) and attaches the result to the exercise submission POST as a `progression_scores` object keyed by snake_cased metric name plus the test version, e.g. `{"v": 1, "distance": 5, "used_loop": 10, "precision": 0}`. Scoring failures never affect the visible run.
- **No client-side cross-run state**: every run's scores are submitted, so history and best-score tracking live server-side.

Pilot exercise: `golf-rolling-ball-loop` in `@jiki/curriculum`.

## See Also

- [Interpreters Integration](./interpreters.md) - How interpreters generate frames
- [Scrubber Frames](./scrubber-frames.md) - Frame consumption by UI
- [Orchestrator Pattern](./orchestrator-pattern.md) - State management
