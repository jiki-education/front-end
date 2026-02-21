"use client";
import { useState } from "react";
import type Orchestrator from "../../../lib/Orchestrator";
import { updateReadOnlyRangesEffect } from "../extensions/read-only-ranges/readOnlyRanges";
import { testStyles } from "./styles";

interface ReadOnlyRangesTestProps {
  orchestrator: Orchestrator;
}

export default function ReadOnlyRangesTest({ orchestrator }: ReadOnlyRangesTestProps) {
  const [customRanges, setCustomRanges] = useState<
    Array<{ fromLine: string; toLine: string; fromChar: string; toChar: string }>
  >([{ fromLine: "", toLine: "", fromChar: "", toChar: "" }]);

  const handleSetReadOnly = (readonly: boolean) => {
    orchestrator.setReadonly(readonly);
  };

  const handleSetReadOnlyRanges = () => {
    const editorView = orchestrator.getEditorView();
    if (editorView) {
      const ranges = [
        { fromLine: 1, toLine: 3 }, // Lines 1-3 (whole lines)
        { fromLine: 5, toLine: 5 } // Line 5 (whole line)
      ];

      editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(ranges)
      });
    }
  };

  const handleSetPartialReadOnlyRanges = () => {
    const editorView = orchestrator.getEditorView();
    if (editorView) {
      const ranges = [
        { fromLine: 1, toLine: 1, fromChar: 0, toChar: 10 }, // First 10 chars of line 1
        { fromLine: 3, toLine: 3, fromChar: 5 } // From char 5 to end of line 3
      ];

      editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(ranges)
      });
    }
  };

  const handleClearReadOnlyRanges = () => {
    const editorView = orchestrator.getEditorView();
    if (editorView) {
      editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of([])
      });
    }
  };

  const handleCustomRangeChange = (
    index: number,
    field: "fromLine" | "toLine" | "fromChar" | "toChar",
    value: string
  ) => {
    const newRanges = [...customRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setCustomRanges(newRanges);
  };

  const handleAddCustomRange = () => {
    setCustomRanges([...customRanges, { fromLine: "", toLine: "", fromChar: "", toChar: "" }]);
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
      const validRanges = customRanges
        .map((range) => {
          const fromLine = parseInt(range.fromLine);
          const toLine = parseInt(range.toLine);
          const fromChar = range.fromChar ? parseInt(range.fromChar) : undefined;
          const toChar = range.toChar ? parseInt(range.toChar) : undefined;
          return { fromLine, toLine, fromChar, toChar };
        })
        .filter(
          (range) =>
            !isNaN(range.fromLine) &&
            !isNaN(range.toLine) &&
            range.fromLine > 0 &&
            range.toLine > 0 &&
            range.fromLine <= range.toLine
        )
        .map((range) => ({
          fromLine: range.fromLine,
          toLine: range.toLine,
          ...(range.fromChar !== undefined && !isNaN(range.fromChar) ? { fromChar: range.fromChar } : {}),
          ...(range.toChar !== undefined && !isNaN(range.toChar) ? { toChar: range.toChar } : {})
        }));

      editorView.dispatch({
        effects: updateReadOnlyRangesEffect.of(validRanges)
      });
    }
  };

  const inputStyle = {
    width: "50px",
    padding: "4px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    fontSize: "12px"
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
        <button onClick={handleSetPartialReadOnlyRanges} style={testStyles.button}>
          Set Partial ReadOnly
        </button>
        <button onClick={handleClearReadOnlyRanges} style={testStyles.button}>
          Clear ReadOnly Ranges
        </button>
        <button onClick={() => handleSetReadOnly(false)} style={testStyles.dangerButton}>
          Clear All ReadOnly
        </button>
      </div>

      <p style={testStyles.helpText}>
        ReadOnly ranges protect specific lines or character ranges from editing. Try whole-line or partial-line
        readonly.
      </p>

      <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>Custom Readonly Ranges</h4>

        {customRanges.map((range, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <label style={{ fontSize: "11px", minWidth: "50px" }}>fromLine:</label>
            <input
              type="number"
              min="1"
              value={range.fromLine}
              onChange={(e) => handleCustomRangeChange(index, "fromLine", e.target.value)}
              placeholder="#"
              style={inputStyle}
            />
            <label style={{ fontSize: "11px", minWidth: "40px" }}>toLine:</label>
            <input
              type="number"
              min="1"
              value={range.toLine}
              onChange={(e) => handleCustomRangeChange(index, "toLine", e.target.value)}
              placeholder="#"
              style={inputStyle}
            />
            <label style={{ fontSize: "11px", minWidth: "55px" }}>fromChar:</label>
            <input
              type="number"
              min="0"
              value={range.fromChar}
              onChange={(e) => handleCustomRangeChange(index, "fromChar", e.target.value)}
              placeholder="opt"
              style={inputStyle}
            />
            <label style={{ fontSize: "11px", minWidth: "45px" }}>toChar:</label>
            <input
              type="number"
              min="0"
              value={range.toChar}
              onChange={(e) => handleCustomRangeChange(index, "toChar", e.target.value)}
              placeholder="opt"
              style={inputStyle}
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
