# Exercise System

The exercise system provides a structured way to create and manage coding exercises in Jiki.

## Navigation

- **Context Root**: [.context/README.md](./README.md)
- **Related**:
  - [Complex Exercise System](./coding-exercise/README.md) - Exercise execution environment
  - [Orchestrator Pattern](./coding-exercise/orchestrator-pattern.md) - How exercises are managed

## Directory Structure

Exercises live in `components/exercises/` with the following structure:

```
components/exercises/
├── index.ts                 # Exercise registry with dynamic imports
├── types.ts                 # Shared type definitions
└── [exercise-slug]/         # Individual exercise directory
    ├── index.ts            # Main export (ExerciseDefinition)
    ├── Exercise.ts         # Exercise class implementation
    ├── scenarios.ts        # Tasks and test scenarios
    └── metadata.json       # Exercise metadata and content
```

## Core Types

### ExerciseDefinition

The main interface that defines an exercise. See `@jiki/curriculum/src/exercises/types.ts` for the complete type definition.

Key fields include:

- `stubs: Record<Language, string>` - Starting code templates for each language
- `solutions: Record<Language, string>` - Complete solutions for each language
- Language-specific code files (`.javascript`, `.py`, `.jiki`) imported as text

### Task and Scenario Types

See `@jiki/curriculum/src/exercises/types.ts` for Task and Scenario type definitions.

## Creating a New Exercise

### 1. Create Exercise Directory

Create a new directory under `components/exercises/` with your exercise slug:

```
components/exercises/your-exercise-slug/
```

### 2. Define Metadata (metadata.json)

Create `metadata.json` with exercise metadata (slug, title, instructions, estimatedMinutes, levelId, hints). See `@jiki/curriculum/src/exercises/acronym/metadata.json` for a complete example.

### 3. Implement Exercise Class (Exercise.ts)

Create the exercise implementation extending the base Exercise class from `@jiki/curriculum`. See `@jiki/curriculum/src/exercises/basic-movement/Exercise.ts` for a complete example.

### 4. Define Tasks and Scenarios (scenarios.ts)

Define the tasks and test scenarios. See `@jiki/curriculum/src/exercises/basic-movement/scenarios.ts` for a complete example.

### 5. Create Solution and Stub Files

Create separate code files for each language:

- `solution.javascript`, `solution.py`, `solution.jiki` - Complete solutions
- `stub.javascript`, `stub.py`, `stub.jiki` - Starting templates

### 6. Export Exercise Definition (index.ts)

Combine metadata, code files, and exercise class. Import solution/stub files as text and structure them in the ExerciseDefinition. See `@jiki/curriculum/src/exercises/acronym/index.ts` for a complete example.

### 7. Register in Exercise Index

Add your exercise to `@jiki/curriculum/src/exercises/index.ts` following the existing pattern of dynamic imports.

## Usage in Components

Exercises are loaded asynchronously and passed to the Orchestrator. The Orchestrator constructor now requires both an `ExerciseDefinition` and a `Language` parameter. See `components/coding-exercise/CodingExercise.tsx` for the complete implementation.

## Best Practices

1. **Keep metadata in JSON**: All static content should be in `metadata.json` for easy editing
2. **Type safety**: Use TypeScript interfaces for all exercise data
3. **Clear naming**: Use descriptive slugs and IDs that match the exercise purpose
4. **Comprehensive tests**: Include multiple scenarios covering edge cases
5. **User-friendly content**: Write clear instructions, helpful hints, and complete solutions
6. **Separation of concerns**: Keep exercise logic in the Exercise class, test logic in scenarios

## Example Exercises

See `@jiki/curriculum/src/exercises/` for complete exercise implementations:

- `basic-movement/` - Simple visual exercise with movement commands
- `acronym/` - IO-based exercise for text processing
- `maze-solve-basic/` - More complex visual maze navigation
