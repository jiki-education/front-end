export function reportError(error: unknown): void {
  console.error(error);
  if (process.env.NODE_ENV !== "production") return;
  import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.captureException(error);
    })
    .catch(() => {
      // Sentry failed to load - nothing we can do
    });
}
