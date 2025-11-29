"use client";

import { useEffect, useState } from "react";
import type { RateLimitError } from "@/lib/api/client";

interface RateLimitModalProps {
  error?: RateLimitError;
}

export function RateLimitModal({ error }: RateLimitModalProps) {
  const retryAfterSeconds = error?.retryAfterSeconds || 60;
  const [secondsLeft, setSecondsLeft] = useState(retryAfterSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold text-text-primary">Too Many Requests</h2>
      <p className="text-text-secondary">You&apos;ve made too many requests. We&apos;re automatically retrying in:</p>
      <div className="flex justify-center">
        <div className="text-4xl font-bold text-text-primary tabular-nums">{secondsLeft}s</div>
      </div>
      <p className="text-text-secondary text-sm text-center">This modal will close automatically when we retry.</p>
    </div>
  );
}
