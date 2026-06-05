import * as Sentry from "@sentry/nextjs";

export function reportError(error: unknown): void {
  console.error(error);
  if (process.env.NODE_ENV !== "production") return;
  Sentry.captureException(error);
}
