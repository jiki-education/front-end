import { useEffect } from "react";
import type { StreamStatus } from "./chat-types";

export function useTypingScroll(messagesEndRef: React.RefObject<HTMLDivElement | null>, status: StreamStatus) {
  useEffect(() => {
    if (status !== "typing") {
      return;
    }

    const intervalId = setInterval(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [status, messagesEndRef]);
}
