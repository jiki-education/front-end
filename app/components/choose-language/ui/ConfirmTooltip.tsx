"use client";

import { useState, cloneElement, isValidElement, useRef } from "react";
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
  useDismiss,
  arrow,
  FloatingArrow
} from "@floating-ui/react";
import styles from "../ChooseLanguage.module.css";

interface ConfirmTooltipProps {
  children: React.ReactElement;
  disabled: boolean;
}

export function ConfirmTooltip({ children, disabled }: ConfirmTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(14),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef })
    ]
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
            style={floatingStyles}
            {...getFloatingProps()}
            className={styles.tooltipContainer}
          >
            <div className={`${styles.tooltip} ${isOpen ? styles.tooltipVisible : ""}`} role="tooltip">
              Select one of the options to proceed.
              <FloatingArrow ref={arrowRef} context={context} className={styles.tooltipArrow} width={16} height={8} />
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
