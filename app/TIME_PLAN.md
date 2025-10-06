# Time Scale Architecture Plan

## Overview

The codebase uses two different time scales for different purposes:

- **Microseconds (μs)**: Used by the interpreter and scrubber for fine-grained control
- **Milliseconds (ms)**: Used by AnimeJS for animations

The conversion factor between them is `TIME_SCALE_FACTOR = 1000`.

## Core Concepts

### 1. Interpreter Time (Microseconds)

- **Purpose**: Provides fine-grained control for code execution tracking
- **Usage**: Frame.time field, scrubber values, interpreter execution
- **Benefits**: Allows precise frame-by-frame stepping without cluttering the timeline
- **Example**: A simple expression might increment time by 0.01μs

### 2. Animation Time (Milliseconds)

- **Purpose**: Compatible with AnimeJS which expects milliseconds
- **Usage**: Frame.timeInMs field, animation durations, animation seek operations
- **Benefits**: Standard unit for web animations
- **Example**: AnimeJS.seek(timeInMs) expects milliseconds

### 3. TIME_SCALE_FACTOR

- **Value**: 1000
- **Location**: Exported from `interpreters/src/shared/frames.ts`
- **Usage**: Convert microseconds to milliseconds by dividing by TIME_SCALE_FACTOR
- **Formula**: `timeInMs = time / TIME_SCALE_FACTOR`

## Implementation Tasks

### ✅ Completed Tasks

1. **Export TIME_SCALE_FACTOR from interpreters package**
   - Added export in `interpreters/src/shared/frames.ts`
   - Used throughout codebase for conversions

2. **Rename timelineTime to timeInMs**
   - Clearer naming to avoid confusion
   - Updated all references in:
     - Frame type definition
     - Orchestrator methods
     - TimelineManager
     - AnimationTimeline
     - All test files

3. **Fix time conversions**
   - AnimationTimeline.seek() converts from microseconds to milliseconds
   - TimelineManager.setTime() uses TIME_SCALE_FACTOR for conversion
   - Scrubber input uses microseconds directly

4. **Update test frame creation**
   - Created `createTestFrame` factory function
   - Takes microseconds as input
   - Automatically calculates timeInMs
   - Made line parameter optional (defaults to 1)

### 🔄 In Progress Tasks

5. **Fix TypeScript compilation errors**
   - Update all test files to use createTestFrame
   - Remove duplicate mock frame creation functions
   - Ensure all Frame objects have required fields

### 📋 Pending Tasks

6. **Run E2E tests**
   - Verify the time scale changes work in practice
   - Test scrubber functionality with microsecond precision

7. **Update context documentation**
   - Document time scales in `.context/complex-exercise/`
   - Explain the microsecond/millisecond split

## File Changes Summary

### Core Files

- `interpreters/src/shared/frames.ts`: Export TIME_SCALE_FACTOR, define Frame with time and timeInMs
- `interpreters/src/jikiscript/executor.ts`: Create frames with both time scales
- `fe/components/complex-exercise/lib/orchestrator/TimelineManager.ts`: Use TIME_SCALE_FACTOR for conversions
- `fe/components/complex-exercise/lib/AnimationTimeline.ts`: Work with timeInMs for animations

### Test Files

- `fe/components/complex-exercise/lib/test-utils/createTestFrame.ts`: Factory for test frames
- All test files: Updated to use createTestFrame instead of manual frame creation

### Configuration

- `fe/next.config.ts`: Added `transpilePackages: ['interpreters']`
- `fe/package.json`: Removed --turbopack flags
- `interpreters/tsconfig.build.json`: Exclude tests from build

## Key Principles

1. **Microseconds for precision**: The scrubber and interpreter use microseconds for fine-grained control
2. **Milliseconds for animations**: AnimeJS requires milliseconds, so we convert at the boundary
3. **Clear naming**: Use `time` for microseconds, `timeInMs` for milliseconds
4. **Consistent conversion**: Always use TIME_SCALE_FACTOR for converting between scales
5. **Test data factories**: Use createTestFrame for consistent test data creation

## Testing Strategy

1. **Unit tests**: Verify conversions work correctly in isolation
2. **Integration tests**: Ensure scrubber and animations sync properly
3. **E2E tests**: Validate the full user experience with proper time scales

## Migration Notes

When updating code that uses time values:

1. Determine if you're working with microseconds or milliseconds
2. Use `time` field for microseconds (interpreter/scrubber)
3. Use `timeInMs` field for milliseconds (animations)
4. Convert between them using TIME_SCALE_FACTOR
5. Never hardcode conversion factors - always import TIME_SCALE_FACTOR
