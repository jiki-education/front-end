"use client";
import { useState } from "react";
import type Orchestrator from "../../../lib/Orchestrator";
import { updateReadOnlyRangesEffect } from "../extensions/read-only-ranges/readOnlyRanges";
import { testStyles } from "./styles";

interface ReadOnlyRangesTestProps {
  orchestrator: Orchestrator;
}

export default function ReadOnlyRangesTest({ orchestrator }: ReadOnlyRangesTestProps) {
  const [customRanges, setCustomRanges] = useState<Array<{ from: string; to: string }>>([{ from: "", to: "" }]);

  const handleSetReadOnly = (readonly: boolean) => {
    orchestrator.setReadonly(readonly);
  };

  const handleSetReadOnlyRanges = () => {
    // Apply readonly ranges to specific lines (lines 1-3 and line 5)
    const editorView = orchestrator.getEditorView();
    if (editorView) {
      const ranges = [
        { from: 1, to: 3 }, // Lines 1-3
        { from: 5, to: 5 } // Line 5
      ];

      // Use the orchestrator's method to apply readonly ranges
      editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(ranges)
      });
    }
  };

  const handleClearReadOnlyRanges = () => {
    // Clear all readonly ranges
    const editorView = orchestrator.getEditorView();
    if (editorView) {
      editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of([])
      });
    }
  };

  const handleCustomRangeChange = (index: number, field: "from" | "to", value: string) => {
    const newRanges = [...customRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setCustomRanges(newRanges);
  };

  const handleAddCustomRange = () => {
    setCustomRanges([...customRanges, { from: "", to: "" }]);
  };

  const handleRemoveCustomRange = (index: number) => {
    if (customRanges.length > 1) {
      const newRanges = customRanges.filter((_, i) => i !== index);
      setCustomRanges(newRanges);
    }
  };

  const handleApplyCustomRanges = () => {
    const editorView = orchestrator.getEditorView();
    if (editorView) {
      // Convert string inputs to numbers and filter out invalid ranges
      const validRanges = customRanges
        .map((range) => ({
          from: parseInt(range.from),
          to: parseInt(range.to)
        }))
        .filter(
          (range) => !isNaN(range.from) && !isNaN(range.to) && range.from > 0 && range.to > 0 && range.from <= range.to
        );

      editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(validRanges)
      });
    }
  };

  return (
    <div style={testStyles.container}>
      <h3 style={testStyles.title}>Read-Only Ranges</h3>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>
          <input type="checkbox" onChange={(e) => handleSetReadOnly(e.target.checked)} style={testStyles.checkbox} />
          Make entire editor read-only
        </label>
      </div>

      <div style={testStyles.buttonGroup}>
        <button onClick={handleSetReadOnlyRanges} style={testStyles.button}>
          Set ReadOnly Lines (1-3, 5)
        </button>
        <button onClick={handleClearReadOnlyRanges} style={testStyles.button}>
          Clear ReadOnly Ranges
        </button>
        <button onClick={() => handleSetReadOnly(false)} style={testStyles.dangerButton}>
          Clear All ReadOnly
        </button>
      </div>

      <p style={testStyles.helpText}>
        ReadOnly ranges protect specific lines from editing. Try setting lines 1-3 and line 5 as readonly.
      </p>

      <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>Custom Readonly Ranges</h4>

        {customRanges.map((range, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", minWidth: "30px" }}>From:</label>
            <input
              type="number"
              min="1"
              value={range.from}
              onChange={(e) => handleCustomRangeChange(index, "from", e.target.value)}
              placeholder="Line #"
              style={{
                width: "60px",
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "3px",
                fontSize: "12px"
              }}
            />
            <label style={{ fontSize: "12px", minWidth: "20px" }}>To:</label>
            <input
              type="number"
              min="1"
              value={range.to}
              onChange={(e) => handleCustomRangeChange(index, "to", e.target.value)}
              placeholder="Line #"
              style={{
                width: "60px",
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "3px",
                fontSize: "12px"
              }}
            />
            {customRanges.length > 1 && (
              <button
                onClick={() => handleRemoveCustomRange(index)}
                style={{
                  ...testStyles.dangerButton,
                  padding: "4px 8px",
                  fontSize: "11px",
                  minWidth: "auto"
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <div style={testStyles.buttonGroup}>
          <button onClick={handleAddCustomRange} style={{ ...testStyles.button, fontSize: "12px" }}>
            Add Range
          </button>
          <button onClick={handleApplyCustomRanges} style={{ ...testStyles.button, fontSize: "12px" }}>
            Apply Custom Ranges
          </button>
        </div>
      </div>
    </div>
  );
}
