import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement, useRef, useState } from "react";
import type { Placement } from "@floating-ui/react";
import {
  autoUpdate,
  arrow as arrowMiddleware,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  useDismiss,
  useTransitionStyles
} from "@floating-ui/react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
  placement?: Placement;
  offset?: number;
  delay?: number;
  disabled?: boolean;
  className?: string;
  disableFlip?: boolean;
  variant?: "default" | "dark";
  arrow?: boolean;
}

export default function Tooltip({
  children,
  content,
  placement = "top",
  offset: offsetValue = 8,
  delay = 0,
  disabled = false,
  className,
  disableFlip = false,
  variant = "default",
  arrow = false
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      ...(disableFlip
        ? []
        : [
            flip({
              fallbackAxisSideDirection: "start"
            })
          ]),
      shift({ padding: 5 }),
      ...(arrow ? [arrowMiddleware({ element: arrowRef })] : [])
    ]
  });

  const hover = useHover(context, {
    delay: {
      open: delay,
      close: 0
    },
    enabled: !disabled
  });

  const role = useRole(context, { role: "tooltip" });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, role, dismiss]);

  const slideTransform = getSlideTransform(context.placement);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: slideTransform },
    open: { opacity: 1, transform: "translate(0, 0)" },
    close: { opacity: 0, transform: slideTransform }
  });

  if (!isValidElement(children)) {
    return null;
  }

  const childrenWithRef = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps()
  } as any);

  const tooltipClassName = className ?? (variant === "dark" ? styles.dark : styles.default);
  const arrowClassName = variant === "dark" ? styles.arrowDark : styles.arrow;

  return (
    <>
      {childrenWithRef}
      {isMounted && !disabled && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <div style={transitionStyles} className={tooltipClassName}>
              {arrow && (
                <FloatingArrow ref={arrowRef} context={context} className={arrowClassName} width={12} height={6} />
              )}
              {content}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

function getSlideTransform(placement: Placement): string {
  const side = placement.split("-")[0];

  switch (side) {
    case "top":
      return "translateY(4px)";
    case "bottom":
      return "translateY(-4px)";
    case "left":
      return "translateX(4px)";
    case "right":
      return "translateX(-4px)";
    default:
      return "translateY(4px)";
  }
}
