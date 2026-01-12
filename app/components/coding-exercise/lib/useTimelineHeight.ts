import { useEffect } from "react";
import styles from "../ui/chat-panel.module.css";

interface TimelineUpdateRefs {
  chatMessagesRef: React.RefObject<HTMLDivElement | null>;
  scrollWrapperRef: React.RefObject<HTMLDivElement | null>;
}

export function useTimelineHeight(refs: TimelineUpdateRefs, deps: React.DependencyList) {
  const updateTimelineHeight = () => {
    const { chatMessagesRef, scrollWrapperRef } = refs;
    if (!chatMessagesRef.current || !scrollWrapperRef.current) {
      return;
    }

    const firstAvatar = chatMessagesRef.current.querySelector(`.${styles.avatar}`);
    if (!firstAvatar) {
      return;
    }

    const scrollWrapperHeight = scrollWrapperRef.current.scrollHeight;
    const avatarOffsetTop = (firstAvatar as HTMLElement).offsetTop;
    const timelineHeight = scrollWrapperHeight - avatarOffsetTop - 28 - 32;

    chatMessagesRef.current.style.setProperty("--timeline-height", `${timelineHeight}px`);
  };

  useEffect(() => {
    updateTimelineHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- updateTimelineHeight is stable within this hook
  }, deps);

  useEffect(() => {
    const { scrollWrapperRef } = refs;
    if (!scrollWrapperRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateTimelineHeight);
    resizeObserver.observe(scrollWrapperRef.current);

    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs and updateTimelineHeight are stable
  }, []);
}
