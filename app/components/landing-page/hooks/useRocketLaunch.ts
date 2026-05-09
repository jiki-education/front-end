"use client";

import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

// Flame builds for 0.3s, then rocket shoots for 0.45s.
// CSS keyframe delays must match.
const TOTAL_LAUNCH_MS = 750;

export function useRocketLaunch(href: string) {
  const router = useRouter();
  const [launching, setLaunching] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (launching) return;
    e.preventDefault();
    setLaunching(true);
    setTimeout(() => router.push(href), TOTAL_LAUNCH_MS);
  };

  return { launching, handleClick };
}
