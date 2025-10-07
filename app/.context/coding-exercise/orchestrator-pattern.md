# Orchestrator Pattern

The codebase uses an orchestrator pattern for complex components that require centralized state management.

## Navigation

- **Parent**: [Complex Exercise README](./README.md)
- **Related**:
  - [CodeMirror Integration](./codemirror.md) - Editor that uses orchestrator
  - [Scrubber Frames](./scrubber-frames.md) - Frame system managed by orchestrator
  - [Test Runner](./test-runner.md) - Test execution integrated with orchestrator
- **Context Root**: [.context/README.md](../README.md)

## Overview

The orchestrator pattern combines:

- **Zustand stores** for reactive state management
- **Class-based orchestrators** for business logic and methods
- **React hooks** for connecting components to state

## Architecture

### 1. Orchestrator Class (Facade Pattern with Composition)

Located in `components/[feature]/lib/Orchestrator.ts`:

The orchestrator uses a **facade pattern** with internal composition. It maintains a stable public API while delegating implementation to specialized internal classes.

See `components/coding-exercise/lib/Orchestrator.ts` for the implementation.

**Constructor:**

- Takes a single `ExerciseDefinition` parameter containing all exercise metadata
- Initializes the store with the exercise configuration
- Creates internal managers (except EditorManager which is created lazily)
- No static factory methods - direct instantiation via `new Orchestrator(exercise)`

**Key Principles:**

- **Single orchestrator instance** stored in useRef to prevent recreation
- **Public methods persist** on orchestrator, providing stable API
- **Internal delegation** to specialized managers for implementation
- **No direct access** to internal managers from components
- **Maintains backwards compatibility** when refactoring internals
- **Lazy instantiation** of EditorManager when DOM element becomes available
- **Stable ref callbacks** created via `setupEditor()` for React lifecycle management
- **Direct method calls** instead of callback indirection for cleaner architecture
- **Proper cleanup** with `editorView.destroy()` to handle React StrictMode

**Internal Managers:**

- **TimelineManager** - Handles frame navigation and timeline positioning
- **EditorManager** - Manages CodeMirror editor integration (created/destroyed with DOM element lifecycle)
- **BreakpointManager** - Handles breakpoint navigation and state
- **TestSuiteManager** - Manages test execution and results

### 2. React Hook

Export a hook that connects components to the orchestrator's store using `useStore` with `useShallow` to prevent infinite render loops.

### 3. Component Usage

Components create a single orchestrator instance using `useRef`, access state via the custom hook, and pass the orchestrator to child components as a prop.

## Key Principles

1. **Instance-based stores**: Each orchestrator creates its own store to avoid global state pollution
2. **Separation of concerns**: Read operations via hooks, write operations via orchestrator methods
3. **useShallow**: Prevents infinite render loops by doing shallow equality checks
4. **Prop drilling orchestrator**: Pass the orchestrator instance to child components that need it

## Benefits

- **Encapsulation**: Store internals are hidden, only public methods exposed
- **Type safety**: Full TypeScript support for state and methods
- **Testability**: Easy to test orchestrator logic in isolation
- **Performance**: React only re-renders when selected state changes
- **Maintainability**: Internal refactoring doesn't break component contracts
- **Separation of Concerns**: Each internal manager handles one domain

## Implementation with Composition

When refactoring a large orchestrator, break it into specialized managers:

### Internal Manager Classes

Each manager is a private class that handles a specific domain:

- **EditorManager** (`orchestrator/EditorManager.ts`) - Handles all CodeMirror interactions, requires DOM element upfront, guarantees editorView exists
- **TimelineManager** (`orchestrator/TimelineManager.ts`) - Handles timeline and frame navigation, calculates frame positions

### Orchestrator as Facade

The orchestrator maintains the public API and delegates to internal managers:

- **EditorManager** created lazily when DOM element becomes available via `setupEditor()` ref callback
- **TimelineManager** created during orchestrator construction
- Public methods delegate to appropriate managers while hiding implementation details
- Returns stable ref callbacks for React lifecycle management

This ensures:

- Components only interact with the orchestrator's public methods
- Internal structure can be refactored without changing the public API
- Each manager can be tested independently
- The orchestrator remains the single source of truth passed around

## Example: CodingExercise

The CodingExercise feature demonstrates this pattern:

- `components/coding-exercise/Orchestrator.ts` - Main orchestrator class
- `components/coding-exercise/CodingExercise.tsx` - Root component
- `components/coding-exercise/CodeEditor.tsx` - Child using orchestrator
- `components/coding-exercise/RunButton.tsx` - Child using orchestrator

### Component Implementation

The root CodingExercise component:

1. Uses `useRef` to store the orchestrator instance (prevents recreation)
2. Loads the exercise definition asynchronously
3. Creates the orchestrator once with `new Orchestrator(exercise)`
4. Passes orchestrator to children via props

### React StrictMode Compatibility

The editor setup properly handles React StrictMode's double-mounting:

1. `setupEditor()` returns a stable ref callback
2. EditorManager is cleaned up (with `editorView.destroy()`) when element is null
3. EditorManager is recreated when element is provided again
4. This ensures no duplicate editors in development mode

Each child component receives the orchestrator and uses `useOrchestratorStore(orchestrator)` to subscribe to state changes.

## Lifecycle Management and Navigation

### Page Navigation Behavior

When users navigate away from the coding-exercise page:

1. **Complete Component Unmounting**: The entire `CodingExercise` component tree unmounts
2. **Orchestrator Destruction**: The orchestrator instance (stored in `useRef`) is garbage collected
3. **Store Destruction**: The Zustand store (created as an instance property) is destroyed with the orchestrator
4. **Proper Cleanup**: EditorManager's cleanup method ensures CodeMirror resources are properly disposed
5. **Fresh Instance on Return**: Navigating back creates a completely new orchestrator and store instance

### Data Persistence

While the orchestrator and store are destroyed on navigation:

- **localStorage Persistence**: User code and exercise progress are saved to localStorage
- **Automatic Restoration**: When returning to an exercise, saved data is loaded from localStorage
- **Exercise UUID Key**: Each exercise uses its slug as a unique key for localStorage

### Store Access Pattern

The `useOrchestratorStore` hook requires an orchestrator instance, ensuring store isolation:

```typescript
// Hook signature requires orchestrator instance
useOrchestratorStore(orchestrator: { getStore: () => StoreApi<OrchestratorStore> })
```

Components access the orchestrator through:

1. **Direct Props**: Passed down from parent components
2. **React Context**: Via `OrchestratorProvider` and `useOrchestrator()` hook

This pattern ensures:

- Store access is scoped to the component tree
- No global state pollution
- Clear ownership and lifecycle management

## Verified Risks and Considerations

### Memory Management

**Risk**: Memory leaks from lingering orchestrator/store references
**Verification**: Confirmed that orchestrator and store are properly garbage collected on unmount
**Mitigation**: Using `useRef` prevents recreation during renders while allowing cleanup on unmount

### Navigation State Loss

**Risk**: Users losing work when navigating away
**Verification**: localStorage persistence maintains user code and progress
**Mitigation**: Auto-save functionality stores changes immediately

### Store Isolation

**Risk**: Multiple exercise instances interfering with each other
**Verification**: Each orchestrator creates its own store instance
**Mitigation**: Instance-based stores with no global state sharing

### React StrictMode Double-Mounting

**Risk**: Duplicate editor instances or resource leaks in development
**Verification**: Editor cleanup and recreation handled correctly
**Mitigation**: Stable ref callbacks and proper cleanup in EditorManager

### Context Provider Boundaries

**Risk**: Components trying to access orchestrator outside provider
**Verification**: Hook throws clear error when used outside provider
**Mitigation**: Type-safe context with runtime validation

### Concurrent Navigation

**Risk**: Race conditions during rapid navigation
**Verification**: Each navigation creates independent instances
**Mitigation**: No shared state between navigation cycles

## Frame and Timeline System

### Frame Structure

Frames represent execution states at specific points in time. The Frame interface includes:

- `time` - Time in microseconds (keeps frames in order with minimal timeline impact)
- `timeInMs` - Time in milliseconds (for animations and UI display)
- `line` - Line number in code
- `status` - SUCCESS or ERROR
- `generateDescription()` - Function that returns human-readable description

### Timeline Management

The orchestrator manages timeline state and provides methods for navigation:

- `setCurrentTestTime(time: number)` - Set the current time position in microseconds
- `getNearestCurrentFrame(): Frame | null` - Get nearest frame to current position

### Scrubber Components

The scrubber UI is modularized into focused components:

- `Scrubber.tsx` - Main container that coordinates state
- `ScrubberInput.tsx` - Range input for timeline scrubbing
- `FrameStepperButtons.tsx` - Previous/next frame navigation

Each component receives the orchestrator and uses the enabled prop pattern based on test state, edit state, spotlight mode, and frame availability.

## Success Celebration Flow

When all tests pass, the orchestrator triggers a celebration flow with visual feedback and a success modal.

### Flow Sequence

1. **Test Execution Completes**: All tests pass
2. **Spotlight Activation**: `isSpotlightActive` set to `true` in `setTestSuiteResult()`
3. **Test Animation Plays**: First test animates with spotlight effect on the test view
4. **Animation Completes**: Timeline `onComplete` callback triggers
5. **Modal Display**: Success modal appears with congratulations message
6. **State Reset**: `isSpotlightActive` set to `false`, `wasSuccessModalShown` set to `true`

### State Management

**`isSpotlightActive: boolean`**

- Set to `true` when all tests pass (in `setTestSuiteResult()`)
- Controls whether spotlight class is applied to test result view
- Set to `false` after success modal is shown
- Prevents UI interaction during celebration animation

**`wasSuccessModalShown: boolean`**

- Tracks whether success modal has been displayed for current test run
- Set to `true` after modal is shown
- Reset to `false` on new test run (in `setTestSuiteResult()`)
- Ensures modal only appears once per successful test run

**`allTestsPassed: boolean`**

- Calculated once when test results are set (in `setTestSuiteResult()`)
- Cached in state to avoid repeated calculations across components
- Used by UI components and callbacks to determine if all tests passed
- Reset on new test run

### Implementation Details

The success modal is triggered in the `onComplete` callback registered when setting the current test. The callback uses `get()` to read from current state rather than relying on closures, ensuring it always sees the latest state values:

```typescript
test.animationTimeline.onComplete(() => {
  get().setIsPlaying(false);
  get().setIsSpotlightActive(false);

  // Only show modal once when all tests pass
  if (get().allTestsPassed && !get().wasSuccessModalShown) {
    showModal("exercise-success-modal");
    get().setWasSuccessModalShown(true);
  }
});
```

Key implementation notes:

- Spotlight always turns off when any test animation completes
- Modal only shows on first completion when all tests passed
- Using `get()` prevents closure bugs when switching between tests

See `components/coding-exercise/lib/orchestrator/store.ts:177-186` for implementation.

### User Experience

- **Visual Spotlight**: Test view highlighted during animation
- **Automatic Trigger**: No user action required
- **One-Time Display**: Modal shown once per successful test run
- **Clean Reset**: New test runs reset state for fresh celebration
