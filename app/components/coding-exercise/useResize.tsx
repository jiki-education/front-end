import { assembleClassNames } from "@/lib/assemble-classnames";
import React, { useEffect, useRef } from "react";

type Direction = "horizontal" | "vertical";

const STORAGE_KEY = "coding-exercise-panel-sizes";
const LHS_MIN_PIXELS = 400;

function clampVerticalPercentage(percentage: number, containerWidth: number) {
  const minPercentage = Math.max(30, (LHS_MIN_PIXELS / containerWidth) * 100);
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

function applyVertical(container: HTMLDivElement, divider: HTMLButtonElement | null, percentage: number) {
  const leftFr = percentage / 50;
  const rightFr = (100 - percentage) / 50;
  container.style.gridTemplateColumns = `${leftFr}fr ${rightFr}fr`;
  container.style.setProperty("--lhs-width", `${percentage}%`);
  if (divider) {
    divider.style.left = `${percentage}%`;
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
        container.style.gridTemplateRows = `${clamped}px 1fr`;
        if (horizontalDividerRef.current) {
          horizontalDividerRef.current.style.top = `${clamped}px`;
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
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const container = containerRef.current;
    const verticalDivider = verticalDividerRef.current;

    let latestPercentage: number | null = null;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingVertical.current || !container || !verticalDivider) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const offsetX = moveEvent.clientX - containerRect.left;
      const rawPercentage = (offsetX / containerRect.width) * 100;
      const percentage = clampVerticalPercentage(rawPercentage, containerRect.width);

      latestPercentage = percentage;
      applyVertical(container, verticalDivider, percentage);
    };

    const handleMouseUp = () => {
      if (isDraggingVertical.current) {
        isDraggingVertical.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
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
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

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
        horizontalDivider.style.top = pixelPosition + "px";
        container.style.gridTemplateRows = `${pixelPosition}px 1fr`;
      }
    };

    const handleMouseUp = () => {
      if (isDraggingHorizontal.current) {
        isDraggingHorizontal.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
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
