import type { Placement } from "@floating-ui/react";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole
} from "@floating-ui/react";
import type { ReactElement } from "react";
import { cloneElement, isValidElement, useId, useState } from "react";
import type { LessonData } from "./types";
import { TooltipContent } from "./ui/TooltipContent";

interface LessonTooltipProps {
  children: ReactElement;
  exercise: LessonData;
  placement?: Placement;
  offset?: number;
  onNavigate?: (route: string) => void;
}

export function LessonTooltip({
  children,
  exercise,
  placement = "bottom",
  offset: offsetValue = 12,
  onNavigate
}: LessonTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headingId = useId();
  const descriptionId = useId();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({ fallbackAxisSideDirection: "start", crossAxis: false }),
      shift({ padding: 8, crossAxis: true })
    ]
  });

  const click = useClick(context);
  const role = useRole(context, { role: "dialog" });
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
    escapeKey: true
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);

  if (!isValidElement(children)) {
    return null;
  }

  const childrenWithRef = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps(),
    "data-tooltip-open": isOpen
  } as any);

  return (
    <>
      {childrenWithRef}
      {isOpen && !exercise.locked && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              role="dialog"
              aria-labelledby={headingId}
              aria-describedby={descriptionId}
            >
              <TooltipContent
                exercise={exercise}
                onClose={() => setIsOpen(false)}
                onNavigate={onNavigate}
                headingId={headingId}
                descriptionId={descriptionId}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
