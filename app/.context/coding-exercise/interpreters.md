# Interpreters Integration

This document explains how the interpreters workspace package integrates with the complex exercise system.

## Navigation

- **Parent**: [Complex Exercise README](./README.md)
- **Related**:
  - [Test Runner](./test-runner.md) - Uses interpreters for execution
  - [Time Scales](./time-scales.md) - Microsecond/millisecond conversion
  - [Scrubber Frames](./scrubber-frames.md) - Frame consumption
- **Context Root**: [.context/README.md](../README.md)

## Overview

The interpreters workspace package (`interpreters`) provides educational code execution with frame-by-frame tracking. It's a separate package in the monorepo that the frontend imports as a dependency.

## Package Location

- **Source**: `../interpreters/` (sibling directory to fe)
- **Import**: `import { ... } from 'interpreters'`
- **Build**: Compiled to single ESM bundle with type definitions

## Key Exports

### Frame System

```typescript
import { Frame, FrameExecutionStatus, TIME_SCALE_FACTOR } from "interpreters";

interface Frame {
  line: number; // Line number in source code
  code: string; // Code being executed
  status: FrameExecutionStatus; // "SUCCESS" | "ERROR"
  time: number; // Microseconds
  timeInMs: number; // Milliseconds (time / TIME_SCALE_FACTOR)
  generateDescription: () => string; // Lazy description generation
  error?: any; // Error details if failed
  result?: any; // Evaluation result
  data?: Record<string, any>; // Additional interpreter data
}
```

### Interpreters

```typescript
import { JikiscriptInterpreter } from "interpreters";
import { JavaScriptInterpreter } from "interpreters"; // In development
import { PythonInterpreter } from "interpreters"; // Basic implementation
```

### Time Scaling

```typescript
import { TIME_SCALE_FACTOR } from "interpreters";
// TIME_SCALE_FACTOR = 1000 (microseconds to milliseconds)
```

## Integration Points

### Test Runner

The test runner (`lib/test-runner/`) uses interpreters to execute student code:

1. **JikiScript Execution**: Uses `JikiscriptInterpreter` for frame-by-frame execution
2. **JavaScript Execution**: External execution with limited frame data
3. **Frame Generation**: Interpreter generates frames during execution
4. **Animation Sync**: Frame times used to schedule animations

### Timeline System

The timeline components consume frame data:

1. **TimelineManager**: Navigates frames using microsecond precision
2. **AnimationTimeline**: Converts to milliseconds for anime.js
3. **Scrubber UI**: Displays frame timeline for navigation

### CodeMirror Integration

Editor features driven by frame data:

1. **Line Highlighting**: Current frame determines highlighted line
2. **Error Display**: Frame errors shown as information widgets
3. **Variable Inspection**: Frame data shows variable states

## Frame Generation Details

### Microsecond Timing

Frames use microseconds for fine-grained control:

- **Small expressions**: 1-4 microseconds (nearly invisible on timeline)
- **Standard operations**: 100-1000 microseconds
- **Animations**: Can jump time using `fastForward()`

### Description Generation

Frames use lazy description generation for performance:

```typescript
frame.generateDescription(); // Called only when needed by UI
```

This defers expensive string operations, providing ~9x performance improvement.

### Educational Features

Interpreters provide educational enhancements:

- **Friendly Errors**: Student-focused error messages
- **Progressive Syntax**: Features can be enabled/disabled
- **Execution Descriptions**: Plain-language explanations
- **Variable Tracking**: State snapshots at each frame

## Language-Specific Details

### JikiScript

- **Full Frame Support**: Every expression generates a frame
- **Educational Focus**: Simplified JavaScript-like syntax
- **Custom Objects**: JikiObjects wrap primitives for tracking
- **Configurable**: Language features can be toggled

### JavaScript

- **External Execution**: Uses native JS execution
- **Limited Frames**: Less granular than JikiScript
- **Error Mapping**: Maps runtime errors to source lines

### Python

- **Basic Implementation**: Core features supported
- **Frame Generation**: Similar to JikiScript approach
- **Educational Errors**: Python-specific error messages

## Testing with Interpreters

When testing components that use interpreters:

```typescript
import { createTestFrame } from "@/components/coding-exercise/lib/test-utils/createTestFrame";

// Creates frame with correct time/timeInMs ratio
const frame = createTestFrame(100000, {
  // 100ms in microseconds
  line: 5,
  generateDescription: () => "Test description"
});
```

## Important Notes

1. **Always use TIME_SCALE_FACTOR**: Never hardcode 1000
2. **Frame times are microseconds**: UI converts to milliseconds
3. **Lazy descriptions**: Call `generateDescription()` only when needed
4. **Workspace dependency**: Changes to interpreters require rebuild

## See Also

- [Test Runner](./test-runner.md) - How tests execute with interpreters
- [Time Scales](./time-scales.md) - Detailed time conversion explanation
- [Scrubber Frames](./scrubber-frames.md) - How UI consumes frames
- Interpreters documentation: `../interpreters/.context/`
