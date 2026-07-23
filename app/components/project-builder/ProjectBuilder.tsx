"use client";

// Root component for the project-builder: creates the orchestrator once and
// lays out the three panes (files+editor | preview | chat) plus the dev-only
// debug drawer.

import { useEffect, useRef } from "react";
import { Orchestrator } from "./lib/Orchestrator";
import type { LessonConfig } from "./lib/types";
import { ChatPane } from "./ui/ChatPane";
import { CodeEditor } from "./ui/CodeEditor";
import { DebugDrawer } from "./ui/DebugDrawer";
import { FileTree } from "./ui/FileTree";
import { PreviewPane } from "./ui/PreviewPane";

export default function ProjectBuilder({ lesson }: { lesson: LessonConfig }) {
  const orchestratorRef = useRef<Orchestrator | null>(null);
  orchestratorRef.current ??= new Orchestrator(lesson);
  const orchestrator = orchestratorRef.current;

  useEffect(() => {
    return () => {
      orchestrator.cleanup();
    };
  }, [orchestrator]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex min-h-0 flex-1">
        <aside className="w-48 shrink-0 border-r border-border-primary bg-bg-secondary">
          <FileTree orchestrator={orchestrator} />
        </aside>
        <section className="min-w-0 flex-1 border-r border-border-primary">
          <CodeEditor orchestrator={orchestrator} />
        </section>
        <section className="min-w-0 flex-1 border-r border-border-primary">
          <PreviewPane orchestrator={orchestrator} />
        </section>
        <section className="flex w-96 shrink-0 flex-col">
          <ChatPane orchestrator={orchestrator} />
        </section>
      </div>
      <DebugDrawer orchestrator={orchestrator} />
    </div>
  );
}
