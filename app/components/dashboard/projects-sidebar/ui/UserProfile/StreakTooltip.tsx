"use client";

import type { ReactElement } from "react";
import { cloneElement, isValidElement, useRef, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  arrow,
  FloatingArrow,
  FloatingPortal,
  useHover,
  useInteractions,
  useDismiss,
  useRole
} from "@floating-ui/react";
import styles from "./StreakTooltip.module.css";

interface StreakTooltipProps {
  children: ReactElement;
  content: string;
}

export function StreakTooltip({ children, content }: StreakTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    strategy: "fixed",
    middleware: [offset(8), shift({ padding: 8 }), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss, role]);

  if (!isValidElement(children)) {
    return null;
  }

  const childWithRef = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps()
  } as React.Attributes);

  return (
    <>
      {childWithRef}
      <FloatingPortal>
        {isOpen && (
          <div ref={refs.setFloating} style={floatingStyles} className={styles.tooltip} {...getFloatingProps()}>
            <FloatingArrow ref={arrowRef} context={context} fill="var(--color-gray-800)" width={12} height={6} />
            {content}
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
