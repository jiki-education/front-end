"use client";
import { useState } from "react";
import type Orchestrator from "../../../lib/Orchestrator";
import { useOrchestratorStore } from "../../../lib/Orchestrator";
import { testStyles } from "./styles";

interface BreakpointTestProps {
  orchestrator: Orchestrator;
}

export default function BreakpointTest({ orchestrator }: BreakpointTestProps) {
  const { breakpoints } = useOrchestratorStore(orchestrator);
  const [customBreakpoints, setCustomBreakpoints] = useState<string>("");

  const handleSetBreakpoints = () => {
    const lines = customBreakpoints
      .split(",")
      .map((line) => parseInt(line.trim()))
      .filter((line) => !isNaN(line));

    orchestrator.setBreakpoints(lines);
  };

  const handleClearBreakpoints = () => {
    orchestrator.setBreakpoints([]);
    setCustomBreakpoints("");
  };

  return (
    <div style={testStyles.container}>
      <h3 style={testStyles.title}>Breakpoints</h3>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Current breakpoints:</label>
        <span style={testStyles.statusText}>{breakpoints.length > 0 ? breakpoints.join(", ") : "None"}</span>
      </div>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Set breakpoints (comma-separated):</label>
        <input
          type="text"
          value={customBreakpoints}
          onChange={(e) => setCustomBreakpoints(e.target.value)}
          placeholder="1, 3, 5"
          style={{ ...testStyles.input, width: "120px" }}
        />
        <button onClick={handleSetBreakpoints} style={testStyles.button}>
          Apply
        </button>
      </div>

      <div style={testStyles.buttonGroup}>
        <button onClick={() => orchestrator.setBreakpoints([1, 3])} style={testStyles.button}>
          Set Lines 1, 3
        </button>
        <button onClick={() => orchestrator.setBreakpoints([2, 4, 6])} style={testStyles.button}>
          Set Lines 2, 4, 6
        </button>
        <button onClick={handleClearBreakpoints} style={testStyles.dangerButton}>
          Clear All
        </button>
      </div>

      <p style={testStyles.helpText}>Click on line numbers in the editor to toggle breakpoints.</p>
    </div>
  );
}
