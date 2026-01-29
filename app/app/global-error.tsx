"use client";

import { useEffect } from "react";
import { ErrorRobot } from "./components/ErrorRobot";
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
          <div className={styles.logo}>JIKI</div>

          <ErrorRobot variant="serverError" />

          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.subtitle}>We encountered an unexpected error. Sorry about that!</p>

          <button onClick={reset} className={`ui-btn ui-btn-default ui-btn-primary ${styles.button}`}>
            Try again &rarr;
          </button>
        </div>
      </body>
    </html>
  );
}
