import { captureRequestError } from "@sentry/nextjs";

export async function register() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = process.env.NODE_ENV === "production" ? captureRequestError : () => {};
