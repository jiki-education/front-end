import React from "react";
import type Orchestrator from "@/components/complex-exercise/lib/Orchestrator";

interface LineFoldingControlsProps {
  orchestrator: Orchestrator;
}

export function LineFoldingControls({ orchestrator }: LineFoldingControlsProps) {
  const handleFoldLines = (lines: number[]) => {
    const store = orchestrator.getStore();
    const currentState = store.getState();
    const newFoldedLines = [...new Set([...currentState.foldedLines, ...lines])];

    // Use the setFoldedLines action which will recalculate prev/next frames
    store.getState().setFoldedLines(newFoldedLines);
  };

  const handleUnfoldLines = (lines: number[]) => {
    const store = orchestrator.getStore();
    const currentState = store.getState();
    const newFoldedLines = currentState.foldedLines.filter((line) => !lines.includes(line));

    // Use the setFoldedLines action which will recalculate prev/next frames
    store.getState().setFoldedLines(newFoldedLines);
  };

  const handleClearFoldedLines = () => {
    // Use the setFoldedLines action which will recalculate prev/next frames
    orchestrator.getStore().getState().setFoldedLines([]);
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="font-bold mb-2">Line Folding Controls:</h2>
      <div className="flex gap-2 flex-wrap">
        <button
          data-testid="fold-line-2"
          onClick={() => handleFoldLines([2])}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Fold Line 2
        </button>
        <button
          data-testid="fold-line-3"
          onClick={() => handleFoldLines([3])}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Fold Line 3
        </button>
        <button
          data-testid="fold-lines-2-3"
          onClick={() => handleFoldLines([2, 3])}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Fold Lines 2 & 3
        </button>
        <button
          data-testid="unfold-line-2"
          onClick={() => handleUnfoldLines([2])}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Unfold Line 2
        </button>
        <button
          data-testid="unfold-line-3"
          onClick={() => handleUnfoldLines([3])}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Unfold Line 3
        </button>
        <button
          data-testid="clear-folded-lines"
          onClick={handleClearFoldedLines}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Clear All Folds
        </button>
      </div>
    </div>
  );
}
