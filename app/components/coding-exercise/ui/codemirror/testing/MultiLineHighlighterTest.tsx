import type Orchestrator from "../../../lib/Orchestrator";
import { testStyles } from "./styles";

interface MultiLineHighlighterTestProps {
  orchestrator: Orchestrator;
}

export default function MultiLineHighlighterTest({ orchestrator }: MultiLineHighlighterTestProps) {
  const handleHighlightMultipleLines = (lines: number[]) => {
    // Now we can highlight non-contiguous lines directly
    orchestrator.setMultipleLineHighlights(lines);
  };

  const handleHighlightRange = (startLine: number, endLine: number) => {
    orchestrator.setMultiLineHighlight(startLine, endLine);
  };

  const handleClear = () => {
    orchestrator.setMultipleLineHighlights([]);
  };

  return (
    <div style={testStyles.container}>
      <h3 style={testStyles.title}>Multi-Line Highlighter</h3>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Start Line:</label>
        <input
          type="number"
          min="1"
          placeholder="Start"
          id="multi-start"
          style={{ ...testStyles.input, width: "80px" }}
        />
        <label style={testStyles.label}>End Line:</label>
        <input type="number" min="1" placeholder="End" id="multi-end" style={{ ...testStyles.input, width: "80px" }} />
        <button
          onClick={() => {
            const startInput = document.getElementById("multi-start") as HTMLInputElement;
            const endInput = document.getElementById("multi-end") as HTMLInputElement;
            const start = parseInt(startInput.value) || 1;
            const end = parseInt(endInput.value) || 3;
            handleHighlightRange(start, end);
          }}
          style={testStyles.button}
        >
          Highlight Range
        </button>
      </div>

      <div style={testStyles.buttonGroup}>
        <button onClick={() => handleHighlightMultipleLines([1, 3, 5])} style={testStyles.button}>
          Highlight Lines 1, 3, 5
        </button>
        <button onClick={() => handleHighlightRange(2, 4)} style={testStyles.button}>
          Highlight Lines 2-4
        </button>
        <button onClick={handleClear} style={testStyles.dangerButton}>
          Clear Highlights
        </button>
      </div>

      <p style={testStyles.helpText}>
        Highlights specific lines (can be non-contiguous like 1, 3, 5) or ranges with a different background color.
      </p>
    </div>
  );
}
