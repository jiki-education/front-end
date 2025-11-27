import React from "react";
import { assembleClassNames } from "@/utils/assemble-classnames";
import { useRef, useEffect } from "react";

type Direction = "horizontal" | "vertical";

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

  // Set initial CSS custom property for horizontal divider width
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--lhs-width", "50%");
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

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingVertical.current || !container || !verticalDivider) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const offsetX = moveEvent.clientX - containerRect.left;
      const percentage = (offsetX / containerRect.width) * 100;

      if (percentage >= 30 && percentage <= 70) {
        // Use fr units instead of percentages to work better with gaps and margins
        const leftFr = percentage / 50; // Convert percentage to fr ratio (50% = 1fr)
        const rightFr = (100 - percentage) / 50;
        container.style.gridTemplateColumns = `${leftFr}fr ${rightFr}fr`;
        container.style.setProperty("--lhs-width", `${percentage}%`);
        verticalDivider.style.left = `${percentage}%`;
      }
    };

    const handleMouseUp = () => {
      if (isDraggingVertical.current) {
        isDraggingVertical.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        activeListenersRef.current.vertical = undefined;
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

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingHorizontal.current || !container || !horizontalDivider) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const offsetY = moveEvent.clientY - containerRect.top;
      const pixelPosition = offsetY;

      if (pixelPosition >= 200 && pixelPosition <= containerRect.height - 200) {
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
