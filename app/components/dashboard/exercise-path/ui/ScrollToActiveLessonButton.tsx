import { useEffect, useRef, useState } from "react";
import styles from "./ScrollToActiveLessonButton.module.css";
import ChevronUpIcon from "@/icons/chevron-up.svg";
import ChevronDownIcon from "@/icons/chevron-down.svg";

interface ScrollToActiveLessonButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ScrollToActiveLessonButton({ containerRef }: ScrollToActiveLessonButtonProps) {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const getActiveEl = () => container.querySelector<HTMLElement>("[data-active-lesson='true']");

    const scrollRoot = getScrollParent(container);

    const observe = (el: HTMLElement) => {
      observerRef.current?.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setDirection(null);
          } else {
            const rect = entry.boundingClientRect;
            const rootMid = entry.rootBounds
              ? (entry.rootBounds.top + entry.rootBounds.bottom) / 2
              : window.innerHeight / 2;
            setDirection(rect.bottom < rootMid ? "up" : "down");
          }
        },
        { root: scrollRoot, threshold: 0.5 }
      );

      observerRef.current.observe(el);
    };

    const el = getActiveEl();
    if (el) {
      observe(el);
    }

    // Re-observe if the active lesson changes (e.g. after completion)
    const mutationObserver = new MutationObserver(() => {
      const newEl = getActiveEl();
      if (newEl) {
        observe(newEl);
      }
    });

    mutationObserver.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-active-lesson"]
    });

    return () => {
      observerRef.current?.disconnect();
      mutationObserver.disconnect();
    };
  }, [containerRef]);

  if (!direction) {
    return null;
  }

  const handleClick = () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const el = container.querySelector<HTMLElement>("[data-active-lesson='true']");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={styles.anchor}>
      <button
        className={styles.button}
        onClick={handleClick}
        aria-label={direction === "up" ? "Scroll up to active lesson" : "Scroll down to active lesson"}
      >
        {direction === "up" ? <ChevronUpIcon width={20} /> : <ChevronDownIcon width={20} />}
      </button>
    </div>
  );
}

function getScrollParent(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}
