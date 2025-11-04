# Exercises

## Overview

Exercises are the core educational units in Jiki. Each exercise teaches a specific programming concept through interactive code execution and visual feedback. Students write code that controls animations, making abstract concepts concrete and visible.

## Exercise Architecture

### Base Exercise Class

All exercises extend the `Exercise` class from `src/Exercise.ts`. See that file for the complete class definition including:

- `animations: Animation[]` - Visual feedback array
- `availableFunctions` - Exercise-specific functions
- `getState()` - Returns exercise state
- `getView()` - Returns HTML element

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

Each exercise defines its own specific functions that become available to students. Functions are defined in snake_case and automatically converted for each language:

- **Python**: `move_forward()`, `turn_left()` (as defined)
- **JavaScript**: `moveForward()`, `turnLeft()` (automatically converted to camelCase)
- **JikiScript**: `moveForward()`, `turnLeft()` (uses camelCase)

See `src/exercises/basic-movement/Exercise.ts` for a complete example of how to structure an exercise class with available functions.

### Step 2: Define Scenarios

Scenarios are like test cases - they provide different starting states and success conditions for the same exercise. All scenarios in an exercise use the same available functions.

See `src/exercises/basic-movement/scenarios.ts` or `src/exercises/acronym/scenarios.ts` for complete examples of how to structure scenarios.

### Step 3: Create Solution and Stub Files

Create language-specific code files (`.javascript`, `.py`, `.jiki`) for both solutions and stubs.

### Step 4: Register the Exercise

Add to the exercise registry in `src/exercises/index.ts` and `src/index.ts` following the existing pattern.

## Animation System

Exercises generate animations that the frontend converts to anime.js timelines. See `src/Exercise.ts` for the complete `Animation` interface definition.

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
