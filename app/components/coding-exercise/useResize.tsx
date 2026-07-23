import { assembleClassNames } from "@/lib/assemble-classnames";
import React, { useEffect, useRef } from "react";

type Direction = "horizontal" | "vertical";

const STORAGE_KEY = "coding-exercise-panel-sizes";
const LHS_MIN_PIXELS = 400;

function clampVerticalPercentage(percentage: number, containerWidth: number) {
  const minPercentage = Math.min(70, Math.max(30, (LHS_MIN_PIXELS / containerWidth) * 100));
  return Math.min(Math.max(percentage, minPercentage), 70);
}

interface StoredPanelSizes {
  verticalPercentage?: number;
  horizontalPixels?: number;
}

function readStoredSizes(): StoredPanelSizes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredSizes(update: StoredPanelSizes) {
  try {
    const current = readStoredSizes();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...update }));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — silently skip persistence
  }
}

// document.body is typed non-null, but React can run these handlers/cleanups
// during page teardown (or after something has wiped the DOM), where it is
// genuinely null - seen in production as JIKI-FRONT-END-3E. Degrade silently:
// there is no body left to style.
function setBodyDragStyles(cursor: string, userSelect: string) {
  const body = document.body as HTMLElement | null;
  if (!body) {
    return;
  }
  body.style.cursor = cursor;
  body.style.userSelect = userSelect;
}

function isRTL(container: HTMLElement) {
  return getComputedStyle(container).direction === "rtl";
}

function applyVertical(container: HTMLDivElement, divider: HTMLButtonElement | null, percentage: number) {
  // `percentage` is always measured from the inline start (the LHS panel's share),
  // so grid tracks stay start→end and follow `direction` automatically.
  const startFr = percentage / 50;
  const endFr = (100 - percentage) / 50;
  container.style.gridTemplateColumns = `${startFr}fr ${endFr}fr`;
  container.style.setProperty("--lhs-width", `${percentage}%`);
  if (divider) {
    // Position from the inline start (not physical `left`) so the divider tracks
    // the LHS/RHS boundary under both LTR and RTL. Inline styles win over the
    // stylesheet's `.verticalDivider { inset-inline-start }`, so we must set the
    // logical property here rather than physical `left`.
    divider.style.insetInlineStart = `${percentage}%`;
  }
}

export function useResizablePanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const verticalDividerRef = useRef<HTMLButtonElement>(null);
  const horizontalDividerRef = useRef<HTMLButtonElement>(null);

  const isDraggingVertical = useRef(false);
  const isDraggingHorizontal = useRef(false);
  const activeListenersRef = useRef<{
    vertical?: { move: (e: MouseEvent) => void; up: () => void };
    horizontal?: { move: (e: MouseEvent) => void; up: () => void };
  }>({});

  // Restore saved panel sizes (or fall back to defaults) on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const stored = readStoredSizes();
    const rawPercentage =
      typeof stored.verticalPercentage === "number" &&
      stored.verticalPercentage >= 30 &&
      stored.verticalPercentage <= 70
        ? stored.verticalPercentage
        : 50;
    const verticalPercentage = clampVerticalPercentage(rawPercentage, container.getBoundingClientRect().width);
    applyVertical(container, verticalDividerRef.current, verticalPercentage);

    if (typeof stored.horizontalPixels === "number") {
      const maxHorizontalPixels = container.getBoundingClientRect().height - 200;
      if (maxHorizontalPixels >= 200) {
        const clamped = Math.min(Math.max(stored.horizontalPixels, 200), maxHorizontalPixels);
        // The 50vh cap keeps the editor row from forcing the grid taller than
        // the viewport if the window shrinks after the size was stored.
        container.style.gridTemplateRows = `min(${clamped}px, 50vh) 1fr`;
        if (horizontalDividerRef.current) {
          horizontalDividerRef.current.style.top = `min(${clamped}px, 50vh)`;
        }
      }
    }
  }, []);

  // Cleanup effect to remove any active event listeners on unmount
  useEffect(() => {
    const listenersRef = activeListenersRef;
    return () => {
      const listeners = listenersRef.current;
      if (listeners.vertical) {
        document.removeEventListener("mousemove", listeners.vertical.move);
        document.removeEventListener("mouseup", listeners.vertical.up);
      }
      if (listeners.horizontal) {
        document.removeEventListener("mousemove", listeners.horizontal.move);
        document.removeEventListener("mouseup", listeners.horizontal.up);
      }
      // Reset cursor and user selection
      setBodyDragStyles("", "");
    };
  }, []);

  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;
    setBodyDragStyles("col-resize", "none");

    const container = containerRef.current;
    const verticalDivider = verticalDividerRef.current;

    let latestPercentage: number | null = null;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingVertical.current || !container || !verticalDivider) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      // Measure from the inline-start edge so `percentage` is always the LHS
      // panel's share: the left edge under LTR, the right edge under RTL.
      const offsetFromStart = isRTL(container)
        ? containerRect.right - moveEvent.clientX
        : moveEvent.clientX - containerRect.left;
      const rawPercentage = (offsetFromStart / containerRect.width) * 100;
      const percentage = clampVerticalPercentage(rawPercentage, containerRect.width);

      latestPercentage = percentage;
      applyVertical(container, verticalDivider, percentage);
    };

    const handleMouseUp = () => {
      if (isDraggingVertical.current) {
        isDraggingVertical.current = false;
        setBodyDragStyles("", "");
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        activeListenersRef.current.vertical = undefined;
        if (latestPercentage !== null) {
          writeStoredSizes({ verticalPercentage: latestPercentage });
        }
      }
    };

    // Store listeners for cleanup
    activeListenersRef.current.vertical = { move: handleMouseMove, up: handleMouseUp };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleHorizontalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHorizontal.current = true;
    setBodyDragStyles("row-resize", "none");

    const container = containerRef.current;
    const horizontalDivider = horizontalDividerRef.current;

    let latestPixels: number | null = null;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingHorizontal.current || !container || !horizontalDivider) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const offsetY = moveEvent.clientY - containerRect.top;
      const pixelPosition = offsetY;

      if (pixelPosition >= 200 && pixelPosition <= containerRect.height - 200) {
        latestPixels = pixelPosition;
        horizontalDivider.style.top = `min(${pixelPosition}px, 50vh)`;
        container.style.gridTemplateRows = `min(${pixelPosition}px, 50vh) 1fr`;
      }
    };

    const handleMouseUp = () => {
      if (isDraggingHorizontal.current) {
        isDraggingHorizontal.current = false;
        setBodyDragStyles("", "");
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        activeListenersRef.current.horizontal = undefined;
        if (latestPixels !== null) {
          writeStoredSizes({ horizontalPixels: latestPixels });
        }
      }
    };

    // Store listeners for cleanup
    activeListenersRef.current.horizontal = { move: handleMouseMove, up: handleMouseUp };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return {
    containerRef,
    verticalDividerRef,
    horizontalDividerRef,
    handleVerticalMouseDown,
    handleHorizontalMouseDown
  };
}

export const Resizer = React.forwardRef<
  HTMLButtonElement,
  {
    handleMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    direction: Direction;
    className?: string;
    style?: React.CSSProperties;
  }
>(({ handleMouseDown, direction, className = "", style = {} }, ref) => {
  return (
    <button
      ref={ref}
      onMouseDown={handleMouseDown}
      className={assembleClassNames(className, direction === "vertical" ? "cursor-col-resize" : "cursor-row-resize")}
      style={style}
    />
  );
});

Resizer.displayName = "Resizer";
