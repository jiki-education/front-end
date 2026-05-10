"use client";

import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

// Flame builds for 0.3s, then rocket shoots for 0.35s.
// CSS keyframe delays must match.
const TOTAL_LAUNCH_MS = 650;

export function useRocketLaunch(action: string | (() => void)) {
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
      setLaunching(false);
    }, TOTAL_LAUNCH_MS);
  };

  return { launching, handleClick };
}
