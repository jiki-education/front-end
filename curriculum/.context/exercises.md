# Exercises

## Overview

Exercises are the core educational units in Jiki. Each exercise teaches a specific programming concept through interactive code execution and visual feedback. Students write code that controls animations, making abstract concepts concrete and visible.

## Exercise Architecture

### Base Exercise Class

All exercises extend the `Exercise` class from `src/Exercise.ts`:

```typescript
export abstract class Exercise {
  animations: Animation[] = [];
  view: HTMLElement;

  abstract availableFunctions: Array<{
    name: string;
    func: (ctx: ExecutionContext) => void;
    description?: string;
  }>;

  abstract getState(): Record<string, number | string | boolean>;
  getView(): HTMLElement;
}
```

### Key Components

1. **Available Functions**: Each exercise defines functions that students can call in their code (e.g., `moveRight()`, `turnLeft()`)
2. **Animations**: Visual feedback generated when functions are called, showing the effect of the code
3. **State**: Internal exercise state that can be queried and displayed (e.g., player position, score)
4. **View**: HTML element containing the exercise's visual representation

## Exercise Structure

```
src/exercises/
├── index.ts                 # Exercise registry
├── types.ts                 # Shared types
└── [exercise-name]/
    ├── index.ts            # Public exports
    ├── Exercise.ts         # Main implementation
    ├── scenarios.ts        # Difficulty levels
    └── metadata.json       # Exercise metadata
```

## Creating a New Exercise

### Step 1: Create the Exercise Class

Each exercise defines its own specific functions that become available to students. These are not generic functions - they are unique to each exercise and provide the specific behavior for that exercise's puzzle or challenge.

```typescript
// src/exercises/maze-navigation/Exercise.ts
import { Exercise } from "../../Exercise";
import type { ExecutionContext } from "@jiki/interpreters";

export class MazeNavigationExercise extends Exercise {
  private playerX = 0;
  private playerY = 0;

  // These functions are specific to THIS exercise
  availableFunctions = [
    {
      name: "move_forward", // Python: move_forward(), JavaScript: moveForward()
      func: (ctx: ExecutionContext) => {
        this.playerY -= 1;
        this.animations.push({
          targets: "#player",
          offset: ctx.currentTime,
          duration: 300,
          transformations: {
            translateY: this.playerY * 50
          }
        });
      },
      description: "Move the player forward one square"
    },
    {
      name: "turn_left", // Python: turn_left(), JavaScript: turnLeft()
      func: (ctx: ExecutionContext) => {
        // Implementation specific to this exercise's turning logic
      },
      description: "Turn the player left"
    }
  ];

  getState() {
    return {
      x: this.playerX,
      y: this.playerY,
      atGoal: this.isAtGoal()
    };
  }
}
```

Functions are defined in snake_case and automatically converted for each language:

- **Python**: `move_forward()`, `turn_left()` (as defined)
- **JavaScript**: `moveForward()`, `turnLeft()` (automatically converted)

### Step 2: Define Scenarios

Scenarios are like test cases - they provide different starting states and success conditions for the same exercise. All scenarios in an exercise use the same available functions:

```typescript
// src/exercises/maze-navigation/scenarios.ts
export const scenarios = {
  simple: {
    name: "Simple Path",
    description: "Navigate a straight path to the goal",
    // Different starting state
    initialState: {
      playerX: 0,
      playerY: 5,
      goalX: 0,
      goalY: 0,
      obstacles: []
    },
    // Different success criteria
    successCondition: (state) => state.x === 0 && state.y === 0
  },
  complex: {
    name: "Winding Path",
    description: "Navigate around obstacles",
    // More complex starting state
    initialState: {
      playerX: 0,
      playerY: 5,
      goalX: 5,
      goalY: 0,
      obstacles: [
        [1, 3],
        [2, 3],
        [3, 3]
      ] // Wall positions
    },
    // Same functions available, different challenge
    successCondition: (state) => state.x === 5 && state.y === 0
  }
};
```

### Step 3: Register the Exercise

Add to the exercise registry:

```typescript
// src/exercises/index.ts
export { MazeNavigationExercise } from "./maze-navigation";
```

## Animation System

Exercises generate animations that the frontend converts to anime.js timelines:

```typescript
interface Animation {
  targets: string; // CSS selector
  offset: number; // Time offset in ms
  duration?: number; // Animation duration
  easing?: string; // Easing function
  transformations: {
    left?: number;
    top?: number;
    translateX?: number;
    translateY?: number;
    rotate?: number;
    scale?: number;
    opacity?: number;
  };
}
```

### Animation Best Practices

1. **Use ExecutionContext for timing**: Ensures animations sync with code execution
2. **Keep selectors semantic**: Use meaningful IDs like `#player`, `#goal`
3. **Include appropriate durations**: Balance speed and visibility
4. **Maintain state consistency**: Visual state should match internal state

## Exercise Design Principles

### Educational Goals

- **Clear Learning Objectives**: Each exercise teaches specific concepts
- **Progressive Difficulty**: Build on previous knowledge
- **Immediate Feedback**: Visual results show code effects instantly
- **Exploration Friendly**: Allow students to experiment safely

### Technical Guidelines

- **Minimal State**: Keep state simple and focused
- **Pure Functions**: Available functions should be predictable
- **Error Recovery**: Handle edge cases gracefully
- **Performance**: Optimize for smooth animations

## Integration with Frontend

The frontend:

1. Imports exercise classes from this package
2. Instantiates exercises with specific scenarios
3. Provides available functions to the code editor
4. Executes student code with the exercise context
5. Renders animations using anime.js

## Example Exercises

### Basic Movement Exercise

- **Concepts**: Function calls, sequential execution
- **Exercise-specific functions** (defined in snake_case):
  - `move_right` - Move the character right
  - `move_left` - Move the character left
  - `move_up` - Move the character up
  - `move_down` - Move the character down
- **Language usage**:
  - Python: `move_right()` (as defined)
  - JavaScript: `moveRight()` (auto-converted)
- **Goal**: Navigate to a target position

### Loop Practice Exercise

- **Concepts**: For loops, repetition
- **Exercise-specific functions** (defined in snake_case):
  - `move_forward` - Move in current direction
  - `turn_left` - Rotate 90 degrees left
  - `turn_right` - Rotate 90 degrees right
- **Note**: Different exercise, different functions - these are unique to this exercise
- **Goal**: Navigate a repeating pattern efficiently

### Conditional Logic Exercise

- **Concepts**: If statements, boolean logic
- **Exercise-specific functions** (defined in snake_case):
  - `can_move_forward` - Check if path ahead is clear
  - `is_at_goal` - Check if reached the goal
  - `move_forward` - Move one step forward
- **Note**: Each exercise defines what functions make sense for its puzzle
- **Goal**: Navigate a maze with decision points

## Testing Exercises

Exercises should include tests for:

- Function behavior
- State management
- Animation generation
- Edge cases
- Scenario variations

See `tests/Exercise.test.ts` for examples.
