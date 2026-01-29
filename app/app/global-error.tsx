"use client";

import { useEffect } from "react";
import { ErrorPageContent } from "./components/ErrorPage";
// global-error.tsx replaces the entire HTML tree including root layout,
// so it must import globals.css directly to have any styles
import "./globals.css";
import styles from "./components/ErrorPage.module.css";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
    <html lang="en">
      <body className={styles.wrapper}>
        <div className={styles.container}>
          <ErrorPageContent
            variant="serverError"
            title="Something went wrong"
            message="We encountered an unexpected error. Sorry about that!"
            actionLabel="Try again"
            onAction={reset}
          />
        </div>
      </body>
    </html>
  );
}
