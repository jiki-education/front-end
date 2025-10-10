# Test Results Tabbed Interface Implementation Plan

## Overview

Convert the existing `ScenariosPanel` into a tabbed interface with two tabs:

1. **Scenarios tab** - Shows the current test scenarios/results view (existing ScenariosPanel content)
2. **Console tab** - Displays console log output (`logLines`) for the currently selected test

## Data Structure

Log lines are stored in `TestResult`:

```typescript
interface TestResult {
  // ... other fields
  logLines: Array<{ time: number; output: string }>;
}
```

- `time`: Timestamp in microseconds (matching frame time format)
- `output`: The console log message text

## UI Implementation

### 1. Component Structure Refactor

**Replace `ScenariosPanel.tsx` with `TestResultsTabbedView.tsx`:**

```typescript
export function TestResultsTabbedView() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'console'>('scenarios');

  return (
    <div className="test-results-tabbed-view">
      <div className="tab-header">
        <button
          className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          Scenarios
        </button>
        <button
          className={`tab ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'scenarios' && <ScenariosTabContent />}
        {activeTab === 'console' && <ConsoleTab />}
      </div>
    </div>
  );
}
```

**Extract existing ScenariosPanel content into `ScenariosTabContent.tsx`:**

- Move all current ScenariosPanel functionality into this new component
- Keep the same behavior and styling for the scenarios view

**Create new `ConsoleTab.tsx` component:**

```typescript
export function ConsoleTab() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestTime } = useOrchestratorStore(orchestrator);

  if (!currentTest || currentTest.logLines.length === 0) {
    return <div className="console-tab-empty">No console output</div>;
  }

  return (
    <div className="console-tab">
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

**Location:** Replace existing `ScenariosPanel` usage in `TestResultsView.tsx`

### 3. Layout Changes

Modify `app/components/coding-exercise/ui/test-results-view/TestResultsView.tsx`:

```tsx
<div className="test-results-container">
  {/* Replace ScenariosPanel with new tabbed view */}
  <TestResultsTabbedView />
</div>
```

### 4. Styling

**Position**: Bottom-right corner, same location as current ScenariosPanel
**Size**: Maintain same dimensions as current ScenariosPanel

**Tab Header Design**:

```css
.test-results-tabbed-view {
  /* Inherit positioning from current ScenariosPanel */
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.tab {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab.active {
  border-bottom-color: #007acc;
  background: white;
}

.tab-content {
  flex: 1;
  overflow: hidden;
}
```

**Console Tab Design**:

```css
.console-tab {
  background: #1e1e1e; /* Dark terminal-style */
  color: #d4d4d4;
  font-family: "Consolas", "Monaco", monospace;
  font-size: 12px;
  padding: 8px;
  overflow-y: auto;
  height: 100%;
}

.console-tab-empty {
  color: #858585;
  text-align: center;
  padding: 20px;
  font-style: italic;
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

1. **Create `ScenariosTabContent.tsx`** by extracting content from existing `ScenariosPanel.tsx`
2. **Create `ConsoleTab.tsx`** component with basic log rendering
3. **Create `TestResultsTabbedView.tsx`** with tab switching logic
4. **Replace `ScenariosPanel` usage** in `TestResultsView.tsx` with new tabbed view
5. **Add styling** for tab header and console appearance
6. **Connect console tab to orchestrator state** (currentTest, currentTestTime)
7. **Implement time-based highlighting** logic in console tab
8. **Add auto-scroll** behavior for console tab
9. **Test with different scenarios** (no logs, many logs, long logs)
10. **Polish UX** (empty states, tab transitions, etc.)

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
