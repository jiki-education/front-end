import type Orchestrator from "../../../lib/Orchestrator";
import { testStyles } from "./styles";

interface LineHighlighterTestProps {
  orchestrator: Orchestrator;
}

export default function LineHighlighterTest({ orchestrator }: LineHighlighterTestProps) {
  const handleHighlightLine = (lineNumber: number) => {
    orchestrator.setHighlightedLine(lineNumber);
  };

  const handleSetColor = (color: string) => {
    orchestrator.setHighlightedLineColor(color);
  };

  const handleClear = () => {
    orchestrator.setHighlightedLine(0);
  };

  return (
    <div style={testStyles.container}>
      <h3 style={testStyles.title}>Line Highlighter</h3>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Line Number:</label>
        <input
          type="number"
          min="1"
          max="10"
          onChange={(e) => handleHighlightLine(parseInt(e.target.value) || 1)}
          placeholder="Enter line number"
          style={testStyles.input}
        />
      </div>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Color:</label>
        <select onChange={(e) => handleSetColor(e.target.value)} style={testStyles.select}>
          <option value="#ffeb3b">Yellow</option>
          <option value="#f44336">Red</option>
          <option value="#4caf50">Green</option>
          <option value="#2196f3">Blue</option>
          <option value="#ff9800">Orange</option>
        </select>
      </div>

      <div style={testStyles.buttonGroup}>
        <button onClick={() => handleHighlightLine(1)} style={testStyles.button}>
          Highlight Line 1
        </button>
        <button onClick={() => handleHighlightLine(3)} style={testStyles.button}>
          Highlight Line 3
        </button>
        <button onClick={handleClear} style={testStyles.dangerButton}>
          Clear Highlight
        </button>
      </div>
    </div>
  );
}
