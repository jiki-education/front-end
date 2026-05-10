"use client";

import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

// Flame builds for 0.3s, then rocket shoots for 0.35s.
// CSS keyframe delays must match.
const TOTAL_LAUNCH_MS = 650;

interface UseRocketLaunchOptions {
  resetAfterLaunch?: boolean;
}

export function useRocketLaunch(action: string | (() => void), options: UseRocketLaunchOptions = {}) {
  const { resetAfterLaunch = false } = options;
  const router = useRouter();
  const [launching, setLaunching] = useState(false);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (launching) return;
    e.preventDefault();
    setLaunching(true);
    setTimeout(() => {
      if (typeof action === "string") {
        router.push(action);
      } else {
        action();
      }
      if (resetAfterLaunch) {
        setLaunching(false);
      }
    }, TOTAL_LAUNCH_MS);
  };

  return { launching, handleClick };
}
