import { useEffect, useState } from "react";

/**
 * Hook that delays showing loading state for a specified duration to prevent flashing.
 * Only shows loading state if the actual loading takes longer than the delay.
 *
 * @param isLoading - The actual loading state
 * @param delay - Delay in milliseconds before showing loading state (default: 100ms)
 * @returns Delayed loading state that only becomes true after the delay
 */
export function useDelayedLoading(isLoading: boolean, delay: number = 100): boolean {
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (isLoading) {
      // Start a timer to show loading after the delay
      timeout = setTimeout(() => {
        setShouldShowLoading(true);
      }, delay);
    } else {
      // Immediately hide loading when done
      setShouldShowLoading(false);
    }

    // Cleanup timeout on unmount or when loading changes
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoading, delay]);

  return shouldShowLoading;
}
