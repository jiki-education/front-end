import { useEffect } from "react";

export function useAutoScroll(messagesEndRef: React.RefObject<HTMLDivElement | null>, deps: React.DependencyList) {
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- messagesEndRef is stable
  }, deps);
}
