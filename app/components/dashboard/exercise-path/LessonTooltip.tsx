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
import { cloneElement, isValidElement, useId, useState, useRef, useCallback, useEffect } from "react";
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
  const fixedPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open: boolean) => {
      if (open && refs.reference.current) {
        // Capture the initial position when opening the tooltip
        const rect = refs.reference.current.getBoundingClientRect();
        fixedPositionRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.bottom
        };
        // Set initial tooltip position
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.bottom + offsetValue
        });
      } else if (!open) {
        // Clear the positions when closing
        fixedPositionRef.current = null;
        setTooltipPosition(null);
      }
      setIsOpen(open);
    },
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate, // Re-enable autoUpdate since we're handling positioning manually
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

  // Update tooltip position during scroll when open
  const updateTooltipPosition = useCallback(() => {
    if (isOpen && refs.reference.current && fixedPositionRef.current) {
      const rect = refs.reference.current.getBoundingClientRect();

      // Update tooltip position to maintain the same relative position
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + offsetValue
      });
    }
  }, [isOpen, offsetValue, refs.reference]);

  // Listen to scroll events when tooltip is open
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        updateTooltipPosition();
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isOpen, updateTooltipPosition]);

  if (!isValidElement(children)) {
    return null;
  }

  const childrenWithRef = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps(),
    "data-tooltip-open": isOpen
  } as any);

  // Use dynamic tooltip position that follows scroll but ignores scale animation
  const tooltipStyles = tooltipPosition
    ? {
        position: "fixed" as const,
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: "translateX(-50%)",
        zIndex: 1000
      }
    : floatingStyles;

  return (
    <>
      {childrenWithRef}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={tooltipStyles}
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
