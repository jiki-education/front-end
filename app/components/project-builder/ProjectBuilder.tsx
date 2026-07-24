"use client";

// Root component for the project-builder: creates the orchestrator once and
// lays out the four resizable panes (files | editor | preview | chat) plus the
// dev-only debug drawer. The middle group (editor + preview) splits the space
// left over by the fixed-width Files and Jiki rails.

import { useEffect, useRef } from "react";
import { Orchestrator } from "./lib/Orchestrator";
import type { LessonConfig } from "./lib/types";
import styles from "./ProjectBuilder.module.css";
import { ChatPane } from "./ui/ChatPane";
import { CodeEditor } from "./ui/CodeEditor";
import { DebugDrawer } from "./ui/DebugDrawer";
import { FileTree } from "./ui/FileTree";
import { PreviewPane } from "./ui/PreviewPane";
import { useResizablePanels } from "./ui/useResizablePanels";

export default function ProjectBuilder({ lesson }: { lesson: LessonConfig }) {
  const orchestratorRef = useRef<Orchestrator | null>(null);
  orchestratorRef.current ??= new Orchestrator(lesson);
  const orchestrator = orchestratorRef.current;

  const panels = useResizablePanels();

  useEffect(() => {
    return () => {
      orchestrator.cleanup();
    };
  }, [orchestrator]);

  return (
    <div className={styles.root}>
      <div className={styles.workspace} ref={panels.containerRef}>
        <aside className={styles.files} style={{ width: panels.filesCollapsed ? undefined : panels.filesWidth }}>
          <FileTree
            orchestrator={orchestrator}
            collapsed={panels.filesCollapsed}
            onToggleCollapsed={panels.toggleFilesCollapsed}
          />
        </aside>

        <Divider onMouseDown={panels.onDividerMouseDown("files")} disabled={panels.filesCollapsed} />

        <div className={styles.middle} ref={panels.middleRef}>
          <section className={styles.editor} style={{ flexBasis: `${panels.editorPercent}%` }}>
            <CodeEditor orchestrator={orchestrator} />
          </section>

          <Divider onMouseDown={panels.onDividerMouseDown("editor")} />

          <section className={styles.preview}>
            <PreviewPane orchestrator={orchestrator} />
          </section>
        </div>

        <Divider onMouseDown={panels.onDividerMouseDown("jiki")} />

        <section className={styles.chat} style={{ width: panels.jikiWidth }}>
          <ChatPane orchestrator={orchestrator} />
        </section>
      </div>
      <DebugDrawer orchestrator={orchestrator} />
    </div>
  );
}

function Divider({
  onMouseDown,
  disabled = false
}: {
  onMouseDown: (e: React.MouseEvent) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={`${styles.divider} ${disabled ? styles.dividerDisabled : ""}`}
      onMouseDown={onMouseDown}
    />
  );
}
