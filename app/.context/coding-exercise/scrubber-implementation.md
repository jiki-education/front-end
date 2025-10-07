# Scrubber Implementation Details

## Navigation

- **Parent**: [Complex Exercise README](./README.md)
- **Related**:
  - [Scrubber Frames](./scrubber-frames.md) - Frame system concepts
  - [Orchestrator Pattern](./orchestrator-pattern.md) - State management
  - [CodeMirror Integration](./codemirror.md) - Editor synchronization
- **Context Root**: [.context/README.md](../README.md)

## Architecture

The scrubber uses the orchestrator pattern for centralized state management with modular UI components.

## Core Components

### Component Structure

```
components/coding-exercise/ui/scrubber/
├── Scrubber.tsx              # Main container, coordinates state
├── ScrubberInput.tsx          # Range input for timeline scrubbing
├── FrameStepperButtons.tsx   # Previous/next frame navigation
├── BreakpointStepperButtons.tsx # Breakpoint navigation
└── PlayPauseButton.tsx        # Play/pause control for animation
```

### Orchestrator Integration

The orchestrator (`components/coding-exercise/lib/Orchestrator.ts`) manages:

- Timeline state synchronization
- Frame navigation logic
- Timeline time calculations
- Animation timeline integration
- Play/pause state (`isPlaying` in store)

## Key Concepts

### Time Scales

- **Time (Microseconds)**: Minimal impact per frame, allows fine-grained stepping
- **TimeInMs (Milliseconds)**: For animations and UI display
- TIME_SCALE_FACTOR = 1000 for conversions

### Frame Navigation Methods

The orchestrator provides key navigation methods:

- `setCurrentTestTime(time: number)` - Set time position in microseconds
- `getNearestCurrentFrame(): Frame | null` - Get nearest frame to current position
- `snapToNearestFrame()` - Snap to nearest frame (used by pause and scrubber mouseUp)
- `play()` - Start animation playback
- `pause()` - Pause animation and snap to nearest frame

**Performance Optimization**: Previous and next frames are now calculated and stored in the Zustand store for better performance. This avoids recalculating frame positions on every render and enables efficient frame navigation.

### Component Responsibilities

1. **Scrubber.tsx**
   - Manages enabled/disabled state logic
   - Passes orchestrator to child components
   - Handles container click to focus input

2. **ScrubberInput.tsx**
   - Range input for timeline scrubbing
   - Calls `orchestrator.setCurrentTestTime` on change
   - Calls `orchestrator.snapToNearestFrame` on mouse release
   - Keyboard event handlers (space, arrows - TODO)

3. **FrameStepperButtons.tsx**
   - Previous/next frame navigation buttons
   - Calculates frame existence for button states
   - Calls orchestrator methods for navigation

4. **PlayPauseButton.tsx**
   - Play/pause control using emojis (▶️/⏸️)
   - Reads `isPlaying` state from orchestrator store
   - Calls `orchestrator.play()` or `orchestrator.pause()`
   - Only shows when animation timeline exists

## Navigation Controls

### Keyboard Shortcuts (TODO)

Planned keyboard shortcuts in ScrubberInput:

- **Arrow Left**: Previous frame
- **Arrow Right**: Next frame
- **Arrow Down**: First frame
- **Arrow Up**: Last frame
- **Spacebar**: Play/pause

### Mouse Interactions

- **Scrub**: Drag slider to navigate timeline
- **Release**: Snaps to nearest frame via `orchestrator.snapToNearestFrame()`
- **Frame Buttons**: Jump to prev/next frame
- **Container Click**: Focus input for keyboard control

## Enabled State Logic

The scrubber calculates enabled state based on whether there's a current test, code hasn't been edited, spotlight isn't active, and there are at least 2 frames. All child components receive this as an `enabled` prop.

## Animation Timeline Management

### Timeline Synchronization

When switching between tests:

1. The old test's `animationTimeline.clearUpdateCallbacks()` is called to clean up callbacks
2. The new test's `animationTimeline.onUpdate()` is set up to sync timeline position with store
3. The callback converts AnimeJS milliseconds to microseconds using TIME_SCALE_FACTOR

### Play/Pause Implementation

The play/pause functionality uses the orchestrator pattern:

- **State**: `isPlaying` boolean in orchestrator store
- **Play**: Sets `isPlaying` to true, hides information widget, calls `animationTimeline.play()`
- **Pause**: Sets `isPlaying` to false, calls `animationTimeline.pause()`, then `snapToNearestFrame()`

## Frame Structure

The Frame interface (from interpreters package) includes:

- `time` - Time in microseconds (minimal impact per frame)
- `timeInMs` - Time in milliseconds (for animations)
- `line` - Code line number
- `status` - SUCCESS or ERROR
- `generateDescription()` - Function returning human-readable description

## Range Input Calculations

### Min/Max Values

- **Min Value**: -1 for single frame, 0 for multiple frames (see `calculateMinInputValue` in ScrubberInput.tsx)
- **Max Value**: Animation duration × 100 (see `calculateMaxInputValue` in ScrubberInput.tsx)

### Frame Snapping

On mouse release, the scrubber snaps to the nearest frame:

```typescript
function handleOnMouseUp(orchestrator: Orchestrator) {
  const nearestFrame = orchestrator.getNearestCurrentFrame();
  if (nearestFrame) {
    orchestrator.setCurrentTestTime(nearestFrame.time);
  }
}
```

## Testing Strategy

Tests are organized by component responsibility:

- **Scrubber.test.tsx**: Container behavior and prop coordination
- **ScrubberInput.test.tsx**: Range input, onChange, and frame snapping
- **FrameStepperButtons.test.tsx**: Navigation button states and clicks

Each test file uses consistent mock helpers at the top for creating test data.
