# Test Runner Architecture Plan

## Overview

This document outlines the architecture for migrating the test runner system from the prototype to the new coding-exercise component. The test runner executes student code against predefined scenarios, generating frames and animations for visualization through the scrubber.

## Implementation Status

### ✅ Phase 1: Minimal Implementation (Completed)

**What's been built:**

- Basic Exercise system with abstract base class
- BasicExercise implementation with move() function and animation tracking
- Test runner that executes scenarios through Jikiscript interpreter
- Integration with orchestrator via runCode() method
- Proper store updates through TestSuiteManager

**Key files created:**

- `lib/mock-exercise/Exercise.ts` - Abstract base class
- `lib/mock-exercise/BasicExercise.ts` - Minimal exercise with move() function
- `lib/mock-exercise/BasicExercise.test.ts` - Two test scenarios
- `lib/test-runner/runTests.ts` - Test execution engine
- Modified `lib/Orchestrator.ts` - Integration point

### 🔄 Phase 2: Next Steps

**Immediate priorities:**

- Add proper expect DSL for cleaner assertions
- Implement task grouping (currently flattened to scenarios)
- Add bonus test support
- Create more complex exercise examples

**Future enhancements:**

- Extract exercises to separate package
- Add setup functions support
- Implement custom interpreter options per scenario
- Add error scenario testing

## Core Concepts

### Terminology Updates

- **Scenario**: A single test with multiple expectations (previously "test with checks")
- **Task**: A grouping of related scenarios
- **Exercise**: A class containing the problem domain, available functions, and state

## Architecture

### Directory Structure

```
components/coding-exercise/
├── lib/
│   ├── mock-exercise/           # Temporary location, will be extracted
│   │   ├── Exercise.ts         # Base exercise class
│   │   ├── MazeExercise.ts     # Example exercise implementation
│   │   ├── MazeExercise.test.ts # Test definitions
│   │   └── maze.css            # Exercise-specific styles
│   ├── test-runner/
│   │   ├── TestRunner.ts       # Main test execution orchestrator
│   │   ├── ScenarioExecutor.ts # Individual scenario execution
│   │   ├── expect.ts           # Assertion helpers
│   │   ├── dsl.ts              # Test DSL (describe, test, etc.)
│   │   └── types.ts            # All test-related types
│   └── orchestrator/
│       └── TestSuiteManager.ts # Integration with orchestrator
```

## Test Structure

### Exercise Class

```typescript
export abstract class Exercise {
  // State that can be tested
  abstract getState(): Record<string, any>;

  // Functions available to student code
  abstract availableFunctions: Array<{
    name: string;
    func: Function;
    description?: string;
  }>;

  // Animations collected during execution
  animations: Animation[] = [];

  // View for visualization
  abstract getView(): HTMLElement;

  // Default interpreter options for all scenarios
  static defaultInterpreterOptions = {
    timePerFrame: 0.01,
    maxIterations: 1000
  };
}
```

### Test Definition Format

```typescript
// MazeExercise.test.ts
export default {
  title: "Maze Navigation",
  exerciseType: "maze",

  // Default options for all scenarios (can be overridden per scenario)
  interpreterOptions: {
    timePerFrame: 0.01,
    maxIterations: 5000
  },

  tasks: [
    {
      name: "Navigate simple mazes",
      scenarios: [
        {
          slug: "maze-3x3",
          name: "Simple 3x3 maze",
          description: "Guide the character to the end",

          setup(exercise: MazeExercise) {
            exercise.setupGrid([
              [2, 1, 0],
              [0, 0, 0],
              [0, 0, 3]
            ]);
            exercise.setPosition(0, 0);
          },

          // Override interpreter options if needed
          interpreterOptions: {
            maxIterations: 100
          },

          expectations(exercise: MazeExercise) {
            return [
              expect(exercise.position).toEqual({ x: 2, y: 2 }).withError("You didn't reach the end of the maze"),

              expect(exercise.getGameResult()).toBe("win").withError("You didn't complete the maze")
            ];
          }
        }
      ]
    },
    {
      name: "Advanced challenges",
      bonus: true,
      scenarios: [
        // Bonus scenarios
      ]
    }
  ]
};
```

## Execution Flow

### Test Execution Pipeline

1. **Test Suite Initialization**
   - Load exercise class and test definitions
   - Create test suite structure with tasks and scenarios

2. **Scenario Execution** (each scenario runs in isolation)

   ```typescript
   async function executeScenario(scenario, studentCode) {
     // 1. Create fresh exercise instance
     const exercise = new ExerciseClass();

     // 2. Run setup functions
     scenario.setup(exercise);

     // 3. Execute student code with Jikiscript
     const result = await jikiscript.interpret(studentCode, {
       externalFunctions: exercise.availableFunctions,
       options: scenario.interpreterOptions || defaultOptions
     });

     // 4. Collect execution data
     const frames = result.frames;
     const animations = exercise.animations;

     // 5. Run expectations
     const expects = scenario.expectations(exercise);

     // 6. Build animation timeline
     const timeline = buildAnimationTimeline(exercise, frames);

     // 7. Return scenario result
     return {
       slug: scenario.slug,
       name: scenario.name,
       expects: expects,
       frames: frames,
       animationTimeline: timeline,
       status: expects.every((e) => e.pass) ? "pass" : "fail"
     };
   }
   ```

3. **Task Aggregation**
   - Each task tracks completion based on all its scenarios passing
   - Bonus tasks are always executed but shown conditionally

4. **Integration with Orchestrator**
   - TestSuiteManager receives results
   - Updates store with test results and frames
   - UI components react to state changes

## Key Features

### Task Status Logic

- **Task Status**: Derived from scenario statuses (all pass = task passes)
- **Exercise Completion**: All non-bonus tasks must pass
- **Bonus Completion**: Tracked separately, shown after main tasks complete
- **Progress Display**: UI shows task-level progress (e.g., "2/3 scenarios passing")

### Frame and Animation Collection

- **Frames**: Automatically collected by Jikiscript interpreter during execution
- **Animations**: Collected in exercise instance during function calls
- **Timeline**: Built after execution, synchronizing frames with animations
- **Isolation**: Each scenario has its own frames and timeline

### Interpreter Options

- **Default Options**: Defined at exercise level
- **Override Options**: Can be specified per scenario
- **Pass-through**: Options passed directly to Jikiscript interpreter

### Expect DSL

```typescript
// Custom expect implementation with error messages
expect(value).toBe(expected).withError("Custom error message");

expect(value).toEqual(expected).withError("Values don't match");

expect(value).toBeGreaterThan(expected).withError("Value too small");
```

## Integration Points

### With Jikiscript Interpreter

```typescript
import { jikiscript } from "interpreters";
import type { Frame } from "interpreters";

const result = jikiscript.interpret(code, {
  externalFunctions: exercise.availableFunctions,
  options: interpreterOptions
});
// result.frames - execution frames (with time in microseconds, timeInMs in milliseconds)
// result.value - return value
// result.status - success/error
```

### With Orchestrator Store

```typescript
// TestSuiteManager handles updating the store
testSuiteManager.setTestSuiteResult({
  tests: normalScenarioResults,
  status: overallStatus
});

testSuiteManager.setBonusTestSuiteResult({
  tests: bonusScenarioResults,
  status: bonusStatus
});
```

### With Animation System

- Exercises call `this.animations.push()` during execution
- AnimationTimeline builds timeline from animations + frames
- Scrubber uses timeline for navigation

## Migration Steps

1. **Phase 1: Foundation**
   - Create Exercise base class
   - Implement basic test runner structure
   - Connect Jikiscript interpreter

2. **Phase 2: Mock Exercise**
   - Build MazeExercise as proof of concept
   - Create test definitions
   - Implement scenario execution

3. **Phase 3: Integration**
   - Connect with TestSuiteManager
   - Update orchestrator store types
   - Wire up UI components

4. **Phase 4: Polish**
   - Add error handling
   - Implement bonus test logic
   - Add animation timeline building

## Future Considerations

### Exercise Bundling

- Exercises will be extracted to separate repository
- Each exercise bundle includes:
  - Exercise class
  - Test definitions
  - CSS styles
  - Any required assets

### Test Authoring

- Consider visual test builder for non-developers
- Version control for test definitions
- A/B testing different scenario sets

### Performance

- Lazy load exercise bundles
- Cache interpreter results for unchanged code
- Optimize frame generation for long-running code
