import type { EditorView } from "@codemirror/view";
import React, { useMemo } from "react";

import { useOrchestrator } from "../../lib/OrchestratorContext";
import { readonlyCompartment } from "./setup/editorCompartments";
import styles from "../../CodingExercise.module.css";

export { readonlyCompartment };
export type ViewRef = React.MutableRefObject<EditorView | null>;

export function CodeMirror() {
  const orchestrator = useOrchestrator();

  // Get stable editor ref callback - only recreate if orchestrator changes
  const editorRef = useMemo(() => orchestrator.setupEditor(), [orchestrator]);

  return (
    <div className={styles.editorWrapper}>
      <div id="bootcamp-cm-editor" data-testid="codemirror-editor" className={styles.editor} ref={editorRef} />
    </div>
  );
}

// Enable why-did-you-render tracking for this component
if (process.env.NODE_ENV === "development") {
  CodeMirror.whyDidYouRender = true;
}
