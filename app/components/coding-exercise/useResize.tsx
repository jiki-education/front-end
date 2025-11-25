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

  // Set initial CSS custom property for horizontal divider width
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--lhs-width", "50%");
    }
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
        container.style.gridTemplateColumns = `${percentage}% ${100 - percentage}%`;
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
      }
    };

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
      }
    };

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
