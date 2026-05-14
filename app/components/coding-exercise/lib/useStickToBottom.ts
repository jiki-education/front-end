import { useEffect } from "react";

// If the user is within this many pixels of the bottom we treat them as "following
// along" and keep the view pinned as content grows. Scrolled up further than this,
// we leave their position alone — including across window/pane resizes.
const STICK_THRESHOLD = 48;

// Keeps the chat scrolled to the bottom as its content grows, but only while the
// user is actually following along. A ResizeObserver on the inner content element
// fires after layout settles (so there's no race with TypeIt's DOM mutations);
// width-only changes (resizes) don't yank the user because we re-check the flag.
export function useStickToBottom(
  scrollContainerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      return;
    }

    const isNearBottom = () => container.scrollHeight - container.scrollTop - container.clientHeight <= STICK_THRESHOLD;

    // Whether the user is currently following the bottom. Only scroll events update
    // it (content growth doesn't move scrollTop, so it fires none), so it reflects
    // "was the user at the bottom before this change".
    let stuckToBottom = true;

    const handleScroll = () => {
      stuckToBottom = isNearBottom();
    };

    const pinToBottom = () => {
      if (stuckToBottom) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    const observer = new ResizeObserver(pinToBottom);
    observer.observe(content);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [scrollContainerRef, contentRef]);
}
