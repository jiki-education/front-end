# CodeMirror Integration

This document explains the CodeMirror 6 integration in the Jiki frontend, including its architecture, extension system, and interaction with the Orchestrator pattern.

## Navigation

- **Parent**: [Complex Exercise README](./README.md)
- **Related**:
  - [Orchestrator Pattern](./orchestrator-pattern.md) - State management system
  - [Test Runner](./test-runner.md) - Execution and frame generation
  - [Scrubber Implementation](./scrubber-implementation.md) - Timeline UI
- **Context Root**: [.context/README.md](../README.md)

## Overview

CodeMirror 6 is the code editor used in the complex exercise component. It provides syntax highlighting, code folding, breakpoints, line highlighting, and other interactive features for the learn-to-code experience.

## Architecture

### Core Components

#### 1. CodeMirror Component (`components/coding-exercise/ui/codemirror/CodeMirror.tsx`)

The main React component that:

- Renders the editor DOM element
- Connects to the Orchestrator for state management
- Uses `orchestrator.setupEditor()` to get a stable ref callback

Key responsibilities:

- Receives orchestrator instance as prop
- Reads initial state from orchestrator store (defaultCode, shouldAutoRunCode)
- Calls `orchestrator.setupEditor()` which returns a ref callback
- The ref callback manages EditorManager lifecycle based on DOM element availability

#### 2. EditorManager (`components/coding-exercise/lib/orchestrator/EditorManager.ts`)

Class that manages the CodeMirror editor instance:

- Created when DOM element becomes available
- Maintains a readonly `editorView` property that's guaranteed to exist
- Configures all extensions during construction
- Sets up event handlers for editor changes
- Manages cleanup including saving content to localStorage

Key features:

- Takes DOM element in constructor, ensuring editor always exists
- Creates event handlers that update orchestrator state
- Initializes editor with all extensions
- Handles auto-save and immediate save on cleanup
- No null checks needed since editorView is guaranteed

#### 3. Editor Extensions (`editorExtensions.ts`)

Configures all CodeMirror extensions in a specific order:

- Core CodeMirror extensions (minimalSetup, JavaScript support)
- Editor behavior (multi-selection, auto-indent, bracket matching)
- Visual enhancements (line highlights, drop cursor, etc.)
- Custom extensions (breakpoints, folding, readonly ranges, etc.)
- Event listeners passed as callbacks

Key improvement: Extensions receive specific callbacks (like `onCloseInfoWidget`) rather than the entire orchestrator, improving encapsulation.

## Orchestrator Integration

The Orchestrator manages CodeMirror state and provides methods for interaction:

### State Management

The orchestrator maintains editor-related state in its Zustand store, including:

- **Editor visual state**: defaultCode, readonly, highlightedLine, highlightedLineColor, underlineRange, information widget data
- **Editor feature state**: breakpoints, foldedLines, shouldAutoRunCode
- **Error handling**: hasUnhandledError, unhandledErrorBase64

See `components/coding-exercise/lib/orchestrator/store.ts` for the complete state definition.

### Event Handler Creation

The orchestrator provides factory methods for creating CodeMirror event handlers:

These methods are now in EditorManager:

1. **`createEditorChangeHandlers()`**: Returns extensions that respond to document changes
   - Resets information widget
   - Resets highlighted line
   - Auto-saves content with readonly ranges
   - Sets highlight color
   - Hides information widget
   - Marks code as edited
   - Clears underline range
   - Updates breakpoints and folded lines
   - Auto-runs code if enabled (calls `orchestrator.runCode()` directly)

2. **`createBreakpointChangeHandler()`**: Updates breakpoint state when toggled

3. **`createFoldChangeHandler()`**: Updates folded lines when code is folded/unfolded

4. **`createCloseInfoWidgetHandler()`**: Returns callback for closing information widget

### Editor Lifecycle Management

The orchestrator manages EditorManager lifecycle through a ref callback pattern. The `setupEditor()` method returns a stable ref callback that:

- Creates EditorManager when DOM element is available
- Cleans up EditorManager when element is removed
- Ensures ref callback stability across React renders

The EditorManager is created lazily when the DOM element becomes available, and its `editorView` property is guaranteed to exist.

### State Synchronization

The orchestrator subscribes to its own state changes and updates CodeMirror accordingly:

- When `highlightedLine` changes → dispatches line highlight effect
- When `highlightedLineColor` changes → dispatches color change effect
- When `readonly` changes → reconfigures readonly compartment
- When `underlineRange` changes → dispatches underline effect
- When `shouldShowInformationWidget` changes → shows/hides widget
- When `informationWidgetData` changes → updates widget content

## Extension System

### Custom Extensions

#### 1. Breakpoint Gutter (`breakpoint.ts`)

- Adds clickable gutter for setting breakpoints
- Maintains breakpoint state in a StateField
- Dispatches effects when breakpoints are toggled
- Integrates with orchestrator's breakpoint state

#### 2. Line Highlighter (`lineHighlighter.ts`)

- Highlights specific lines with configurable colors
- Uses StateField to track current highlighted line
- Supports color changes via effects
- Used for showing current execution position

#### 3. Underline Range (`underlineRange.ts`)

- Underlines specific text ranges
- Used for highlighting errors or important sections
- Cleans up decorations when editor is cleaned

#### 4. Read-Only Ranges (`read-only-ranges/`)

- Makes specific ranges of code non-editable
- Shows lock icon in gutter for readonly lines
- Maintains ranges in StateField
- Prevents editing of protected code sections

#### 5. Information Widget (`end-line-information/`)

- Shows inline information at end of lines
- Used for displaying errors, hints, or execution results
- Supports HTML content
- Can be shown/hidden via effects

#### 6. Multi-line Highlighter (`multiLineHighlighter.ts`)

- Highlights multiple lines simultaneously
- Used for showing code coverage or multiple errors
- Supports different colors for different line sets

#### 7. JavaScript Theme (`js-theme.ts`)

- Custom syntax highlighting theme
- Configurable colors for different token types
- Optimized for learning environment

#### 8. Fold Gutter (`fold-gutter.ts`)

- Custom folding implementation
- Tracks which functions can be folded
- Integrates with orchestrator's folded lines state

### Extension Patterns

All custom extensions follow similar patterns:

1. **State Management**: Use StateField to maintain extension state
2. **Effects**: Define StateEffect types for state changes
3. **Decorations**: Create visual elements using Decoration API
4. **Event Handling**: Use EditorView.updateListener for changes
5. **Cleanup**: Handle cleanup via effects or unmount

### Compartments

Compartments allow dynamic reconfiguration of extensions:

```typescript
export const readonlyCompartment = new Compartment();
// Can be reconfigured at runtime:
readonlyCompartment.reconfigure([EditorView.editable.of(false)]);
```

## Utility Functions

### State Reading (`getCodeMirrorFieldValue.ts`)

Safely reads values from CodeMirror StateFields, returning the field value or undefined.

### Line Utilities

- `getBreakpointLines(view)`: Returns array of line numbers with breakpoints
- `getFoldedLines(view)`: Returns array of folded line numbers
- `scrollToLine(view, line)`: Scrolls editor to specific line

### Content Management

- `loadCodeMirrorContent(uuid)`: Loads saved content from localStorage
- `saveCodeMirrorContent(uuid, code, ranges)`: Saves content to localStorage

## Event Flow

1. **User edits code** → CodeMirror update listener triggers
2. **Update listener** → Calls orchestrator event handlers
3. **Event handlers** → Update orchestrator state
4. **State change** → Orchestrator subscribers react
5. **Subscribers** → Dispatch effects back to CodeMirror
6. **Effects** → Update editor visual state

## Testing Strategy

The CodeMirror integration uses multiple testing approaches:

### Unit Tests

- Test individual extensions in isolation
- Mock EditorView and state management
- Focus on logic and state transitions

### Integration Tests

- Test CodeMirror with real Orchestrator
- Mock CodeMirror internals but use real state flow
- Verify orchestrator-editor communication

### Manual Testing Components

Located in `components/coding-exercise/ui/codemirror/testing/`:

- Individual test components for each extension
- Visual verification of extension behavior
- Interactive debugging tools

## Performance Considerations

1. **Debounced Auto-save**: Content saves are debounced to reduce localStorage writes
2. **Cached Frame Calculation**: Current frame is cached and invalidated on state changes
3. **Shallow Equality**: Zustand store uses shallow equality for render optimization
4. **Selective Updates**: Only dispatch effects when values actually change

## Error Handling

- Editor mounting errors are caught and stored in orchestrator
- Unhandled errors set `hasUnhandledError` flag
- Error details are base64 encoded for debugging
- Development mode throws errors for immediate feedback

## Key Interactions

### Running Code

1. User clicks run or auto-run is enabled
2. EditorManager calls `orchestrator.runCode()` directly (no callback indirection)
3. Code is retrieved from editor
4. Execution results update orchestrator state
5. Visual feedback shown via extensions

### Setting Breakpoints

1. User clicks in breakpoint gutter
2. Breakpoint effect is dispatched
3. Orchestrator's breakpoint handler updates state
4. UI components react to breakpoint changes

### Code Folding

1. User folds/unfolds code sections
2. Fold effect is dispatched
3. Orchestrator tracks folded lines
4. Frame calculations account for hidden lines

### Line Highlighting

1. Orchestrator sets highlighted line (e.g., during execution)
2. State change triggers subscriber
3. Line highlight effect is dispatched
4. Editor visually highlights the line

## Configuration

The editor is configured with sensible defaults for learning:

- JavaScript syntax highlighting
- Auto-indentation
- Bracket matching
- History (undo/redo)
- Search functionality
- Code folding
- Tab indentation

## Future Enhancements

Potential areas for extension:

- Additional language support
- Collaborative editing features
- Advanced debugging capabilities
- Custom themes
- Performance profiling tools
- Accessibility improvements
