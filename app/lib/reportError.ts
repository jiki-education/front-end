import * as Sentry from "@sentry/nextjs";

export function reportError(error: unknown, captureContext?: { fingerprint?: string[] }): void {
  console.error(error);
  if (process.env.NODE_ENV !== "production") return;
  Sentry.captureException(error, captureContext);
}
