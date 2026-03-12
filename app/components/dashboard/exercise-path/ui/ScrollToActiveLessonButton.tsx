import { useEffect, useRef, useState } from "react";
import styles from "./ScrollToActiveLessonButton.module.css";

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

    mutationObserver.observe(container, { subtree: true, attributes: true, attributeFilter: ["data-active-lesson"] });

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
    <button
      className={styles.button}
      onClick={handleClick}
      aria-label={direction === "up" ? "Scroll up to active lesson" : "Scroll down to active lesson"}
    >
      {direction === "up" ? (
        <svg
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5L10 7.5L15 12.5" />
        </svg>
      ) : (
        <svg
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7.5L10 12.5L15 7.5" />
        </svg>
      )}
    </button>
  );
}

function getScrollParent(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}
