import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement, useState } from "react";
import type { Placement } from "@floating-ui/react";
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

interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
  placement?: Placement;
  offset?: number;
  delay?: number;
  disabled?: boolean;
}

export default function Tooltip({
  children,
  content,
  placement = "top",
  offset: offsetValue = 8,
  delay = 200,
  disabled = false
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({
        fallbackAxisSideDirection: "start"
      }),
      shift({ padding: 5 })
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
      {isOpen && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 px-2 py-1.5 text-xs bg-surface-elevated border border-border-primary text-text-primary rounded-md shadow-lg max-w-xs"
            role="tooltip"
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
