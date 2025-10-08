# Log Tab Implementation Plan

## Overview
Add a tab in the bottom-right area of the coding exercise interface to display console log output (`logLines`) for the currently selected test.

## Data Structure
Log lines are now stored in `TestResult`:
```typescript
interface TestResult {
  // ... other fields
  logLines: Array<{ time: number; output: string }>;
}
```

- `time`: Timestamp in microseconds (matching frame time format)
- `output`: The console log message text

## UI Implementation

### 1. Component Structure

Create new component: `app/components/coding-exercise/ui/test-results-view/LogLinesTab.tsx`

```typescript
export function LogLinesTab() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestTime } = useOrchestratorStore(orchestrator);

  if (!currentTest || currentTest.logLines.length === 0) {
    return <div className="log-tab-empty">No console output</div>;
  }

  return (
    <div className="log-tab">
      {currentTest.logLines.map((log, index) => (
        <LogLine
          key={index}
          log={log}
          isActive={currentTestTime >= log.time}
        />
      ))}
    </div>
  );
}
```

### 2. Integration Point

**Location:** Bottom-right of `ScenariosPanel.tsx` or as a new panel below/beside it

**Options:**
- **Option A**: Add as a tab alongside the existing scenarios/test results view
- **Option B**: Fixed panel at bottom-right that's always visible
- **Option C**: Collapsible panel that can be toggled

**Recommended: Option C** - Collapsible panel for flexibility

### 3. Layout Changes

Modify `app/components/coding-exercise/ui/test-results-view/TestResultsView.tsx`:

Add a log panel section:
```tsx
<div className="test-results-container">
  {/* Existing content */}
  <ScenariosPanel />

  {/* New log panel */}
  <LogPanel />
</div>
```

### 4. Styling

**Position**: Bottom-right corner, similar to how ScenariosPanel is positioned
**Size**:
- Width: ~300-400px (or 30% of container)
- Height: ~200-300px (or expandable)
- Max-height with scroll

**Visual Design**:
```css
.log-tab {
  background: #1e1e1e; /* Dark terminal-style */
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  padding: 8px;
  overflow-y: auto;
  border-radius: 4px;
}

.log-line {
  padding: 2px 0;
  opacity: 0.4; /* Dimmed by default */
}

.log-line.active {
  opacity: 1; /* Highlighted when scrubber reaches this time */
  background: rgba(255, 255, 255, 0.05);
}

.log-timestamp {
  color: #858585;
  margin-right: 8px;
}
```

### 5. Time Synchronization

**Highlight current log based on scrubber position:**
- As user scrubs through the timeline (`currentTestTime` updates)
- Log lines with `time <= currentTestTime` should be highlighted/visible
- Log lines with `time > currentTestTime` should be dimmed or hidden

**Implementation**:
```typescript
const isLogActive = (logTime: number, currentTime: number) => {
  return logTime <= currentTime;
};
```

### 6. Features to Consider

**Basic (MVP)**:
- Display all log lines for current test
- Highlight logs up to current scrubber time
- Scroll to bottom on new test selection

**Enhanced**:
- Click log line to jump scrubber to that timestamp
- Filter/search logs
- Copy log output to clipboard
- Toggle between raw and formatted timestamps

## Implementation Steps

1. **Create LogLinesTab component** with basic rendering
2. **Add styling** for terminal-like appearance
3. **Integrate into TestResultsView** layout
4. **Connect to orchestrator state** (currentTest, currentTestTime)
5. **Implement time-based highlighting** logic
6. **Add auto-scroll** behavior
7. **Test with different scenarios** (no logs, many logs, long logs)
8. **Polish UX** (empty states, loading states, etc.)

## Testing Scenarios

1. Test with no console output (empty state)
2. Test with single log line
3. Test with multiple log lines at different times
4. Scrub timeline and verify highlighting
5. Switch between tests and verify logs update
6. Test with very long log messages (truncation/wrapping)
7. Test with many log lines (scrolling)

## Notes

- Log lines are captured during test execution by the interpreters
- Each interpreter (JS, Python, Jikiscript) has a `log()` method that adds to `logLines`
- The `logLines` array is returned as part of `InterpretResult` and stored in `TestResult`
- Timestamps use microseconds to match the frame timeline precision
