# Complex Exercise System

This directory contains documentation for the Complex Exercise component - the core learn-to-code interface in Jiki. This is a sophisticated system that combines code editing, execution, debugging, and visualization into an integrated learning experience.

## Overview

The Complex Exercise system is built around several interconnected subsystems that work together to provide an interactive coding environment. At its heart is an **Orchestrator** that manages state across all components, ensuring they stay synchronized as users write, run, and debug code.

## Architecture Components

### Core Systems

1. **[Orchestrator Pattern](./orchestrator-pattern.md)**
   - Central state management system
   - Instance-based Zustand store
   - Coordinates all subsystems
   - Handles state synchronization

2. **[CodeMirror Editor](./codemirror.md)**
   - Advanced code editing with syntax highlighting
   - Custom extensions for breakpoints, folding, and line highlighting
   - Integrated with orchestrator for state management
   - Supports readonly ranges and information widgets

3. **[Frame System](./scrubber-frames.md)**
   - Represents code execution as a timeline of frames
   - Each frame captures a moment in execution
   - Enables stepping through code execution
   - Powers debugging and visualization

4. **[Scrubber UI](./scrubber-implementation.md)**
   - Timeline control interface
   - Allows scrubbing through execution frames
   - Play/pause/step controls
   - Visual representation of execution progress

5. **[Test Runner](./test-runner.md)**
   - Executes user code against test cases
   - Generates frame data during execution
   - Handles success/error states
   - Provides execution feedback

## How Components Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                      CodingExercise                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Orchestrator                      │   │
│  │  - Central state management                          │   │
│  │  - Event coordination                                │   │
│  │  - State synchronization                             │   │
│  └──────────┬──────────┬──────────┬────────────────────┘   │
│             │          │          │                         │
│  ┌──────────▼───┐ ┌────▼────┐ ┌──▼──────────┐            │
│  │  CodeMirror  │ │ Scrubber │ │ Test Runner │            │
│  │   Editor     │ │    UI    │ │             │            │
│  └──────────────┘ └─────────┘ └─────────────┘            │
│                                                             │
│  Frame Timeline: [Frame 1]→[Frame 2]→[Frame 3]→...        │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User writes code** in CodeMirror editor
2. **Orchestrator** receives code changes and updates state
3. **User runs code** triggering the Test Runner
4. **Test Runner** executes code and generates frames
5. **Frames** are stored in orchestrator state
6. **Scrubber UI** displays frame timeline
7. **User scrubs** through frames to debug
8. **CodeMirror** highlights current line based on frame
9. **Information widgets** show variable values/errors

## Key Concepts

### Frames

Frames are snapshots of code execution at specific points. Each frame contains:

- Line number being executed
- Execution time (interpreter time and timeline time)
- Status (SUCCESS/ERROR)
- Optional description or error message
- Variable state (when implemented)

### Timeline

The timeline represents the complete execution flow:

- Can be played, paused, or scrubbed
- Maps frames to visual positions
- Handles folded code sections
- Supports breakpoints

### State Management

The Orchestrator pattern ensures:

- Single source of truth for all state
- Predictable state updates
- Component isolation
- Efficient re-renders

## File Structure

```
components/coding-exercise/
├── CodingExercise.tsx          # Main component
├── lib/
│   ├── Orchestrator.ts          # Central orchestrator (facade)
│   ├── AnimationTimeline.ts     # Timeline management
│   ├── types.ts                 # TypeScript types
│   └── orchestrator/            # Orchestrator composition
│       ├── EditorManager.ts     # CodeMirror management
│       ├── TimelineManager.ts   # Timeline & frame logic
│       ├── BreakpointManager.ts # Breakpoint navigation
│       ├── TestSuiteManager.ts  # Test execution management
│       └── store.ts             # Zustand store factory
└── ui/
    ├── CodeEditor.tsx           # Editor wrapper
    ├── codemirror/              # CodeMirror implementation
    │   ├── CodeMirror.tsx       # Main editor component
    │   ├── extensions/          # Custom extensions
    │   ├── setup/               # Configuration
    │   └── utils/               # Utilities
    └── scrubber/                # Scrubber components
        ├── Scrubber.tsx         # Main scrubber
        ├── ScrubberInput.tsx    # Timeline input
        └── FrameStepperButtons.tsx # Control buttons
```

## Development Guidelines

### Adding Features

1. Start by understanding the Orchestrator pattern
2. Determine what state needs to be managed
3. Add state to orchestrator if needed
4. Create UI components that read from orchestrator
5. Use orchestrator methods to update state

### Testing Approach

- Unit test individual components
- Integration test orchestrator interactions
- E2E test complete user workflows
- See test plan in [CODEMIRROR_TEST_PLAN.md](../../CODEMIRROR_TEST_PLAN.md)

### Performance Considerations

- Orchestrator uses shallow equality checks
- Components use memoization where appropriate
- Frame calculations are cached
- Debounced saves to localStorage

## Common Tasks

### Working with the Editor

See [codemirror.md](./codemirror.md) for:

- Adding new extensions
- Modifying editor behavior
- Handling editor events

### Working with Frames

See [scrubber-frames.md](./scrubber-frames.md) for:

- Understanding frame structure
- Calculating frame positions
- Handling folded lines

### Modifying the Orchestrator

See [orchestrator-pattern.md](./orchestrator-pattern.md) for:

- Adding new state
- Creating state update methods
- Subscribing to state changes

## Integration Points

### With Backend

- Exercise data loading
- Code submission
- Test case retrieval
- Progress tracking

### With Frontend

- Navigation between exercises
- User progress display
- Settings management
- Theme application

## Debugging Tips

1. **Check Orchestrator State**: Use React DevTools to inspect store
2. **Monitor Frame Timeline**: Log frame calculations
3. **Verify Event Handlers**: Ensure handlers are properly connected
4. **Track State Updates**: Use Zustand devtools
5. **Check Extension Order**: CodeMirror extensions order matters

## Future Enhancements

- Variable inspection in frames
- Advanced debugging features
- Collaborative editing
- Performance profiling
- Additional language support

---

_For general context documentation, see [../.context/README.md](../README.md)_
_For AI assistant instructions, see [../../AGENTS.md](../../AGENTS.md)_
