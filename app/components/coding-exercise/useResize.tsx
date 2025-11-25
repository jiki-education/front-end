import React from "react";
import { assembleClassNames } from "@/utils/assemble-classnames";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

type Direction = "horizontal" | "vertical";

interface ResizableOptions {
  initialSize: number;
  direction: Direction;
  localStorageId: string;
  primaryMinSize?: number;
  secondaryMinSize?: number;
  onChange?: (newSizes: { primarySize: number; secondarySize: number }) => void;
}

export function useResizablePanels({
  initialSize,
  direction,
  localStorageId,
  primaryMinSize = 250,
  secondaryMinSize = 250,
  onChange
}: ResizableOptions) {
  const [primarySize, setPrimarySize] = useLocalStorage(localStorageId, initialSize);
  const [secondarySize, setSecondarySize] = useState(() => {
    if (typeof window === "undefined") {
      return 400;
    } // SSR fallback
    return (direction === "horizontal" ? window.innerWidth : window.innerHeight) - primarySize;
  });

  const startSizeRef = useRef(primarySize);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof window === "undefined") {
      return;
    }
    const containerSize = direction === "horizontal" ? window.innerWidth : window.innerHeight;
    const startCoordinate = direction === "horizontal" ? e.clientX : e.clientY;

    startSizeRef.current = primarySize;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentCoordinate = direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
      const delta = currentCoordinate - startCoordinate;
      const newPrimarySize = Math.max(
        primaryMinSize,
        Math.min(startSizeRef.current + delta, containerSize - secondaryMinSize)
      );

      setPrimarySize(newPrimarySize);
      setSecondarySize(containerSize - newPrimarySize);
      if (onChange) {
        onChange({
          primarySize: newPrimarySize,
          secondarySize: containerSize - newPrimarySize
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResize = () => {
    if (typeof window === "undefined") {
      return;
    }
    const containerSize = direction === "horizontal" ? window.innerWidth : window.innerHeight;

    const newPrimarySize = Math.min(primarySize, containerSize - 300);
    if (onChange) {
      onChange({
        primarySize: newPrimarySize,
        secondarySize: containerSize - newPrimarySize
      });
    }
    setPrimarySize(newPrimarySize);
    setSecondarySize(containerSize - newPrimarySize);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primarySize, direction]);

  return {
    primarySize,
    secondarySize,
    handleMouseDown
  };
}

export function Resizer({
  handleMouseDown,
  direction,
  className = "",
  style = {}
}: {
  handleMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
  direction: Direction;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onMouseDown={handleMouseDown}
      className={assembleClassNames(
        "",
        className,
        direction === "horizontal" ? "cursor-col-resize" : "cursor-row-resize"
      )}
      style={style}
    >
      {direction === "horizontal" ? "⋮" : "⋯"}
    </button>
  );
}
