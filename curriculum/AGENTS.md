# Instructions for AI Assistants - Jiki Curriculum

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create a new feature branch
git checkout -b feature-branch-name
```

---

This file provides guidance to AI agents when working with the Jiki curriculum repository.

## Repository Overview

This is the **@jiki/curriculum** package - a TypeScript library that defines all exercises and learning content for the Jiki platform. It serves as the central source of educational content that gets consumed by the frontend application, supporting both JavaScript and Python programming languages.

### Purpose

The curriculum repository:

- Defines all coding exercises and their scenarios
- Produces animations that visualize code execution
- Manages exercise state and available functions
- Defines language features for each learning level (AST nodes, feature flags)
- Provides type-safe interfaces for integration with the frontend
- Maintains independence from rendering libraries (like anime.js)

**Note**: The syllabus structure (lessons, ordering, progression) is managed by the API in `curriculum.json`. This repository focuses on exercise implementations and language feature definitions.

### Key Documentation

For detailed information about specific aspects of the curriculum:

- **[Exercises](.context/exercises.md)** - Creating and structuring exercises
- **[Levels](.context/levels.md)** - Language features and AST node restrictions per level
- **[Animations](.context/animations.md)** - Visual feedback system and animation patterns

### Integration with Jiki Ecosystem

- **API**: The `@jiki/api` manages syllabus structure (levels, lessons, ordering) in `curriculum.json`
- **Frontend Consumer**: The `@jiki/fe` package imports and renders exercises from this curriculum
- **Type Bridge**: Provides `Animation` and `Exercise` types that frontend converts to anime.js
- **Interpreter Integration**: Uses `@jiki/interpreters` for execution context and timing control

## Git Workflow

### Creating Pull Requests

After completing work:

```bash
# Make changes
git add .
git commit -m "Add new exercise: [name]"
git push -u origin branch-name
gh pr create --title "Add new exercise: [name]" --body "Description of the exercise"
```

## Project Structure

```
curriculum/
├── .context/                 # Detailed documentation
│   ├── animations.md        # Animation system guide
│   ├── exercises.md         # Exercise creation guide
│   └── levels.md            # Level system documentation
├── src/
│   ├── Exercise.ts           # Base Exercise class and Animation interface
│   ├── index.ts              # Main package exports
│   ├── exercises/            # Individual exercise implementations
│   │   ├── index.ts          # Exercise registry
│   │   ├── types.ts          # Shared exercise types
│   │   └── [exercise-name]/  # Specific exercise folders
│   │       ├── index.ts      # Exercise exports
│   │       ├── Exercise.ts   # Exercise implementation
│   │       └── scenarios.ts  # Exercise scenarios/levels
│   └── levels/               # Learning level definitions (language features)
│       ├── index.ts          # Level registry and helpers
│       ├── types.ts          # Level type definitions
│       ├── using-functions.ts # Using functions level
│       ├── fundamentals.ts   # Basic programming level
│       └── variables.ts      # Variables level
├── dist/                     # Compiled JavaScript output
├── tests/                    # Test files
│   ├── exercises/            # Exercise tests
│   └── levels/               # Level feature tests
├── PLAN.md                   # Type strategy documentation
└── package.json             # Package configuration
```

## Core Concepts

For detailed documentation on each concept, see the `.context/` directory files linked above.

### Language Support

The curriculum supports both JavaScript and Python:

- **Exercises**: Each exercise defines its own functions in snake_case; the interpreter converts to camelCase for JavaScript
- **Levels**: Define allowed syntax nodes and feature flags for each language
- **Interpreters**: The `@jiki/interpreters` package provides execution for both languages and handles naming conventions
- **Scenarios**: Test different starting states and success conditions, regardless of language

### Exercise Class

All exercises extend the base `Exercise` class from `src/Exercise.ts`:

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
}
```

### Animation Type

Exercises produce animations using this interface:

```typescript
export interface Animation {
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

### Exercise Structure

Each exercise typically includes:

1. **Exercise.ts** - Main exercise class implementation
2. **scenarios.ts** - Different difficulty levels or variations
3. **index.ts** - Public exports for the exercise

## Development Workflow

### Commands

```bash
# Development
pnpm run dev          # Watch mode for TypeScript compilation
pnpm run build        # Build the package

# Quality Checks
pnpm run typecheck    # Check TypeScript types
pnpm run lint         # Run ESLint
pnpm run format       # Format with Prettier

# Git Hooks (automatic)
# Pre-commit: Runs format check, lint, and typecheck
```

### Adding a New Exercise

1. **Create exercise folder**: `src/exercises/[exercise-name]/`
2. **Implement Exercise class**:
   - Extend the base `Exercise` class
   - Define `availableFunctions` array (unique to this exercise)
   - Use snake_case for function names (JavaScript conversion is automatic)
   - Implement `getState()` method
   - Create animations in response to function calls
3. **Define scenarios** in `scenarios.ts` (test cases with different states)
4. **Export from** `src/exercises/index.ts`
5. **Test integration** with both JavaScript and Python

### Example Exercise Structure

```typescript
// src/exercises/maze-solve-basic/Exercise.ts
import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import metadata from "./metadata.json";

// Exercises that share common logic inherit from a base class in exercise-categories/
export default class MazeSolveBasicExercise extends MazeExercise {
  static slug = metadata.slug;
}
```

For exercises with unique logic, define it directly:

```typescript
// src/exercises/custom-exercise/Exercise.ts
import { VisualExercise } from "../../VisualExercise";
import type { ExecutionContext } from "@jiki/interpreters";

export default class CustomExercise extends VisualExercise {
  protected get slug() {
    return "custom-exercise";
  }

  private position = 0;

  availableFunctions = [
    {
      name: "move", // snake_case for function names
      func: (ctx: ExecutionContext) => {
        this.position += 10;
        this.animations.push({
          targets: `#${this.view.id} .character`,
          offset: ctx.getCurrentTimeInMs(),
          transformations: { translateX: this.position }
        });
      },
      description: "Move the character right by 10 units"
    }
  ];

  getState() {
    return { position: this.position };
  }
}
```

The interpreter automatically converts function names:

- **Python**: `move_right()` (as defined)
- **JavaScript**: `moveRight()` (auto-converted to camelCase)

## Type Architecture

### Type Flow

1. **Curriculum defines** exercise and animation types
2. **Frontend imports** these types from `@jiki/curriculum`
3. **Frontend converts** animations to anime.js format
4. **TypeScript ensures** compatibility at compile time

### Type Safety Guidelines

- **No `any` types** - Always use explicit types
- **No `unknown` types** - Define proper interfaces
- **State types** - Keep state values as primitives (number, string, boolean)
- **Animation subset** - Only include anime.js properties actually used

### Adding Animation Properties

When adding new animation properties:

1. Add to `Animation.transformations` interface in `Exercise.ts`
2. Ensure the property matches anime.js's AnimationParams
3. TypeScript will validate in frontend's `populateTimeline`

## Best Practices

### Exercise Design

- **Clear objectives** - Each exercise should teach specific concepts
- **Progressive difficulty** - Scenarios should build on previous knowledge
- **Visual feedback** - Animations should clearly show code effects
- **Minimal state** - Keep exercise state simple and focused
- **Language parity** - Functions should work naturally in both JS and Python
- **Exercise-specific functions** - Each exercise defines its own unique functions

### Code Organization

- **Single responsibility** - Each exercise focuses on one concept
- **Consistent naming** - Follow existing exercise naming patterns
- **Documentation** - Include descriptions for all available functions
- **Type exports** - Export all necessary types for frontend consumption

### Animation Guidelines

- **Semantic selectors** - Use meaningful CSS selectors for targets
- **Timing precision** - Use ExecutionContext for accurate timing
- **Smooth transitions** - Include appropriate durations and easing
- **State consistency** - Animations should match internal state

## Integration with Frontend

### How Frontend Uses Curriculum

1. **Import exercise**: `import { BasicMovementExercise } from "@jiki/curriculum"`
2. **Instantiate**: Create exercise instance
3. **Get functions**: Access `availableFunctions` for UI
4. **Execute**: Call functions with ExecutionContext
5. **Render animations**: Convert Animation[] to anime.js timeline

### Coordination Points

- **Package exports** via `src/index.ts`
- **Type compatibility** with anime.js
- **State serialization** for debugging
- **View generation** for exercise display

## Important Rules

1. **Independence from rendering** - Don't depend on anime.js directly
2. **Type safety first** - All interfaces must be properly typed
3. **Backward compatibility** - Don't break existing exercise APIs
4. **Clear documentation** - Document all public APIs
5. **Test scenarios** - Each exercise needs testable scenarios
6. **Language consistency** - Maintain feature parity between JS and Python
7. **Function uniqueness** - Each exercise defines its own specific functions

## Common Tasks

### Running Development Server

```bash
pnpm run dev
```

This starts TypeScript in watch mode, recompiling on changes.

### Building for Production

```bash
pnpm run build
```

Creates optimized JavaScript in `dist/` directory.

### Type Checking

```bash
pnpm run typecheck
```

Validates all TypeScript without emitting files.

## Debugging Tips

- **Check animations array** - Log after each function call
- **Verify state consistency** - State should match visual representation
- **Test timing** - Use different playback speeds
- **Validate selectors** - Ensure target elements exist

## Repository Links

- **Frontend**: https://github.com/exercism/jiki-fe
- **Overview**: ../overview (Strategic documentation)
- **This Repository**: https://github.com/exercism/jiki-curriculum (assumed)

## Contact for Questions

When in doubt about curriculum design or integration:

1. Check existing exercises for patterns
2. Review PLAN.md for type strategy
3. Test with frontend integration
4. Ask for clarification on architectural decisions
