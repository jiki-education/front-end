import type Orchestrator from "../../../lib/Orchestrator";
import { testStyles } from "./styles";

interface UnderlineRangeTestProps {
  orchestrator: Orchestrator;
}

export default function UnderlineRangeTest({ orchestrator }: UnderlineRangeTestProps) {
  const handleUnderlineRange = (from: number, to: number) => {
    orchestrator.setUnderlineRange({ from, to });
  };

  const handleClear = () => {
    orchestrator.setUnderlineRange(undefined);
  };

  return (
    <div style={testStyles.container}>
      <h3 style={testStyles.title}>Underline Range</h3>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>From Position:</label>
        <input type="number" min="0" placeholder="Start position" id="underline-from" style={testStyles.input} />
        <label style={testStyles.label}>To Position:</label>
        <input type="number" min="0" placeholder="End position" id="underline-to" style={testStyles.input} />
        <button
          onClick={() => {
            const fromInput = document.getElementById("underline-from") as HTMLInputElement;
            const toInput = document.getElementById("underline-to") as HTMLInputElement;
            const from = parseInt(fromInput.value) || 0;
            const to = parseInt(toInput.value) || 10;
            handleUnderlineRange(from, to);
          }}
          style={testStyles.button}
        >
          Apply
        </button>
      </div>

      <div style={testStyles.buttonGroup}>
        <button onClick={() => handleUnderlineRange(0, 10)} style={testStyles.button}>
          Underline 0-10
        </button>
        <button onClick={() => handleUnderlineRange(20, 30)} style={testStyles.button}>
          Underline 20-30
        </button>
        <button onClick={handleClear} style={testStyles.dangerButton}>
          Clear Underline
        </button>
      </div>
    </div>
  );
}
