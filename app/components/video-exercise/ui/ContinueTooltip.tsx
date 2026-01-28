"use client";

import { useState, cloneElement, isValidElement } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  useDismiss
} from "@floating-ui/react";
import styles from "../VideoExercise.module.css";

interface ContinueTooltipProps {
  children: React.ReactElement;
  disabled: boolean;
}

export function ContinueTooltip({ children, disabled }: ContinueTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(14), flip({ fallbackAxisSideDirection: "start" }), shift({ padding: 5 })]
  });

  const hover = useHover(context, {
    delay: { open: 0, close: 0 },
    enabled: !disabled
  });

  const role = useRole(context, { role: "tooltip" });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, role, dismiss]);

  if (!isValidElement(children)) {
    return null;
  }

  const childrenWithRef = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps()
  } as any);

  return (
    <>
      {childrenWithRef}
      {!disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? "visible" : "hidden",
              transition: "opacity 200ms ease",
              pointerEvents: isOpen ? "auto" : "none"
            }}
            {...getFloatingProps()}
            className={styles.customTooltip}
            role="tooltip"
          >
            <span>Finish watching to continue</span>
            <div className={styles.tooltipArrow}></div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
