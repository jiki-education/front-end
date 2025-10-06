"use client";
import { useState } from "react";
import type Orchestrator from "../../../lib/Orchestrator";
import { processActionsSequentially } from "../extensions/edit-editor/processActionsSequentially";
import type { EditEditorActions } from "../extensions/edit-editor/processActionsSequentially.types";
import { testStyles } from "./styles";

interface EditEditorTestProps {
  orchestrator: Orchestrator;
}

export default function EditEditorTest({ orchestrator }: EditEditorTestProps) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSequence = async (actions: EditEditorActions) => {
    const editorView = orchestrator.getEditorView();
    if (!editorView) {
      console.warn("Editor view not available");
      return;
    }

    setIsRunning(true);
    try {
      await processActionsSequentially(editorView, actions, actions.uuid);
    } catch (error) {
      console.error("Error running edit sequence:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const runTypeOutDemo = () => {
    const actions: EditEditorActions = {
      uuid: "type-demo-" + Date.now(),
      async: false,
      actions: [
        {
          type: "type-out-code",
          line: 1,
          code: "// This is typed automatically"
        },
        {
          type: "type-out-code",
          line: 2,
          code: "console.log('Hello from edit-editor!');"
        }
      ]
    };
    void handleRunSequence(actions);
  };

  const runHighlightDemo = () => {
    const actions: EditEditorActions = {
      uuid: "highlight-demo-" + Date.now(),
      async: false,
      actions: [
        {
          type: "highlight-code",
          regex: "function|console",
          ignoreCase: true
        }
      ]
    };
    void handleRunSequence(actions);
  };

  const runReadOnlyDemo = () => {
    const actions: EditEditorActions = {
      uuid: "readonly-demo-" + Date.now(),
      async: false,
      actions: [
        {
          type: "mark-lines-as-readonly",
          ranges: [
            { from: 1, to: 2 },
            { from: 4, to: 4 }
          ]
        }
      ]
    };
    void handleRunSequence(actions);
  };

  const runCursorDemo = () => {
    const actions: EditEditorActions = {
      uuid: "cursor-demo-" + Date.now(),
      async: false,
      actions: [
        {
          type: "place-cursor",
          line: 3,
          char: 10
        }
      ]
    };
    void handleRunSequence(actions);
  };

  const runComplexDemo = () => {
    const actions: EditEditorActions = {
      uuid: "complex-demo-" + Date.now(),
      async: false,
      actions: [
        {
          type: "highlight-editor-content"
        },
        {
          type: "delete-editor-content"
        },
        {
          type: "type-out-code",
          line: 1,
          code: "// Complex demo sequence"
        },
        {
          type: "type-out-code",
          line: 2,
          code: "function example() {"
        },
        {
          type: "type-out-code",
          line: 3,
          code: "  return 'Edit editor in action!';"
        },
        {
          type: "type-out-code",
          line: 4,
          code: "}"
        },
        {
          type: "highlight-code",
          regex: "example|return",
          ignoreCase: false
        }
      ]
    };
    void handleRunSequence(actions);
  };

  const clearHighlights = () => {
    const actions: EditEditorActions = {
      uuid: "clear-" + Date.now(),
      async: false,
      actions: [
        {
          type: "remove-highlighting"
        }
      ]
    };
    void handleRunSequence(actions);
  };

  const clearReadOnly = () => {
    const actions: EditEditorActions = {
      uuid: "clear-readonly-" + Date.now(),
      async: false,
      actions: [
        {
          type: "revert-lines-to-editable"
        }
      ]
    };
    void handleRunSequence(actions);
  };

  return (
    <div style={testStyles.container}>
      <h3 style={testStyles.title}>Edit Editor Actions</h3>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Status:</label>
        <span style={testStyles.statusText}>{isRunning ? "Running sequence..." : "Ready"}</span>
      </div>

      <div style={testStyles.buttonGroup}>
        <button onClick={runTypeOutDemo} style={testStyles.button} disabled={isRunning}>
          Type Out Demo
        </button>
        <button onClick={runHighlightDemo} style={testStyles.button} disabled={isRunning}>
          Highlight Words
        </button>
        <button onClick={runReadOnlyDemo} style={testStyles.button} disabled={isRunning}>
          Make Read-Only
        </button>
        <button onClick={runCursorDemo} style={testStyles.button} disabled={isRunning}>
          Place Cursor
        </button>
      </div>

      <div style={testStyles.buttonGroup}>
        <button onClick={runComplexDemo} style={testStyles.secondaryButton} disabled={isRunning}>
          Complex Sequence
        </button>
        <button onClick={clearHighlights} style={testStyles.dangerButton} disabled={isRunning}>
          Clear Highlights
        </button>
        <button onClick={clearReadOnly} style={testStyles.dangerButton} disabled={isRunning}>
          Clear Read-Only
        </button>
      </div>

      <p style={testStyles.helpText}>
        Edit Editor allows server-controlled editing commands. Try the demos to see automated typing, highlighting, and
        readonly regions.
      </p>
    </div>
  );
}
