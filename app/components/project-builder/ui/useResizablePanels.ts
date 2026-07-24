"use client";

// Resizing for the four-pane workspace. Modelled on the coding-exercise
// useResizablePanels, but for three vertical dividers plus a collapsible file
// rail. The container is fixed to its own width and clips overflow, so a
// divider only ever rebalances its two neighbours - nothing can leave the
// screen. The Files and Jiki rails are pixel-width (clamped); the middle group
// splits Editor/Preview by percentage so it always sums to 100%.

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "jiki_project_builder_layout";

const FILES = { min: 160, max: 360, default: 224 };
const JIKI = { min: 300, max: 560, default: 360 };
const EDITOR_PCT = { min: 25, max: 75, default: 50 };

type Divider = "files" | "editor" | "jiki";

interface StoredLayout {
  filesWidth?: number;
  jikiWidth?: number;
  editorPercent?: number;
  filesCollapsed?: boolean;
}

interface DragState {
  divider: Divider;
  startX: number;
  filesWidth: number;
  jikiWidth: number;
  editorWidth: number;
  middleWidth: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function readStored(): StoredLayout {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStored(update: StoredLayout): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), ...update }));
  } catch {
    // localStorage unavailable (private mode, quota) - persistence is best-effort
  }
}

// document.body is typed non-null but can be gone during teardown; degrade quietly.
function setBodyDragStyles(cursor: string, userSelect: string): void {
  const body = document.body as HTMLElement | null;
  if (body) {
    body.style.cursor = cursor;
    body.style.userSelect = userSelect;
  }
}

export interface ResizablePanels {
  filesWidth: number;
  jikiWidth: number;
  editorPercent: number;
  filesCollapsed: boolean;
  toggleFilesCollapsed: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  middleRef: React.RefObject<HTMLDivElement | null>;
  onDividerMouseDown: (divider: Divider) => (e: React.MouseEvent) => void;
}

export function useResizablePanels(): ResizablePanels {
  const [filesWidth, setFilesWidth] = useState(FILES.default);
  const [jikiWidth, setJikiWidth] = useState(JIKI.default);
  const [editorPercent, setEditorPercent] = useState(EDITOR_PCT.default);
  const [filesCollapsed, setFilesCollapsed] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const middleRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  // Restore persisted sizes on mount.
  useEffect(() => {
    const stored = readStored();
    if (typeof stored.filesWidth === "number") {
      setFilesWidth(clamp(stored.filesWidth, FILES.min, FILES.max));
    }
    if (typeof stored.jikiWidth === "number") {
      setJikiWidth(clamp(stored.jikiWidth, JIKI.min, JIKI.max));
    }
    if (typeof stored.editorPercent === "number") {
      setEditorPercent(clamp(stored.editorPercent, EDITOR_PCT.min, EDITOR_PCT.max));
    }
    if (typeof stored.filesCollapsed === "boolean") {
      setFilesCollapsed(stored.filesCollapsed);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }
      const dx = e.clientX - drag.startX;

      if (drag.divider === "files") {
        setFilesWidth(clamp(drag.filesWidth + dx, FILES.min, FILES.max));
      } else if (drag.divider === "jiki") {
        // dragging left grows Jiki
        setJikiWidth(clamp(drag.jikiWidth - dx, JIKI.min, JIKI.max));
      } else {
        const percent = ((drag.editorWidth + dx) / drag.middleWidth) * 100;
        setEditorPercent(clamp(percent, EDITOR_PCT.min, EDITOR_PCT.max));
      }
    };

    const handleMouseUp = () => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }
      dragRef.current = null;
      setBodyDragStyles("", "");
      if (drag.divider === "files") {
        writeStored({ filesWidth });
      } else if (drag.divider === "jiki") {
        writeStored({ jikiWidth });
      } else {
        writeStored({ editorPercent });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setBodyDragStyles("", "");
    };
  }, [filesWidth, jikiWidth, editorPercent]);

  const onDividerMouseDown = useCallback(
    (divider: Divider) => (e: React.MouseEvent) => {
      // The collapsed files rail is not resizable.
      if (divider === "files" && filesCollapsed) {
        return;
      }
      e.preventDefault();
      const middle = middleRef.current;
      dragRef.current = {
        divider,
        startX: e.clientX,
        filesWidth,
        jikiWidth,
        editorWidth: middle ? (middle.offsetWidth * editorPercent) / 100 : 0,
        middleWidth: middle?.offsetWidth ?? 1
      };
      setBodyDragStyles("col-resize", "none");
    },
    [filesCollapsed, filesWidth, jikiWidth, editorPercent]
  );

  const toggleFilesCollapsed = useCallback(() => {
    setFilesCollapsed((prev) => {
      writeStored({ filesCollapsed: !prev });
      return !prev;
    });
  }, []);

  return {
    filesWidth,
    jikiWidth,
    editorPercent,
    filesCollapsed,
    toggleFilesCollapsed,
    containerRef,
    middleRef,
    onDividerMouseDown
  };
}
