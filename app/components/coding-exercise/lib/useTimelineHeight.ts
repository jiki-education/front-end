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

    // Get positions relative to the container
    const containerRect = scrollWrapperRef.current.getBoundingClientRect();
    const firstAvatarRect = (firstAvatar as HTMLElement).getBoundingClientRect();

    // Timeline should extend from first avatar to bottom of container + 32px
    // The avatar's ::after starts at top: 28px (avatar height), so we calculate from there
    const timelineHeight = containerRect.bottom - firstAvatarRect.top - 28;

    chatMessagesRef.current.style.setProperty("--timeline-height", `${Math.max(0, timelineHeight)}px`);
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
