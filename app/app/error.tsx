"use client";

import { useEffect } from "react";
import { ErrorPage } from "./components/ErrorPage";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      import("@sentry/nextjs")
        .then((Sentry) => {
          Sentry.captureException(error);
        })
        .catch(() => {
          // Sentry failed to load - nothing we can do
        });
    }
  }, [error]);

  return (
    <ErrorPage
      statusCode={500}
      title="Something went wrong"
      message="We encountered an unexpected error. Sorry about that!"
      actionLabel="Try again"
      onAction={reset}
    />
  );
}
