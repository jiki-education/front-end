// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://a267475ad61eb120ac13ecddd7379eb7@o4510766458601472.ingest.de.sentry.io/4510766459912272",
    tracesSampleRate: 0.1,
    enableLogs: true,
    sendDefaultPii: true,
    ignoreErrors: [
      // Microsoft Outlook SafeLinks / email-scanner crawlers inject a script that fires a
      // non-Error promise rejection with this value. It has no stack trace and is not a real
      // error, so it slips past the frame-based beforeSend filter below.
      // https://github.com/getsentry/sentry-javascript/issues/3440
      "Object Not Found Matching Id"
    ],
    beforeSend(event) {
      // Drop aborted-request errors - these happen when the user navigates away
      // while a fetch is still in flight, which is expected, not a bug.
      const exception = event.exception?.values?.[0];
      // Opaque DOM resource-load rejections. A failed <img>/<audio>/<video> load
      // (or a media player that wraps loading in a promise) rejects with a raw
      // `Event` of type "error" that carries no stack, so Sentry can only record
      // the useless "Event `Event` (type=error) captured as promise rejection".
      // We re-capture these as a real Error with the failing resource URL in the
      // unhandledrejection listener below, so drop the stackless originals here.
      if (exception?.type === "Event" && (exception.value?.includes("(type=error)") ?? false)) {
        return null;
      }
      if (
        exception?.type === "RequestAbortedError" ||
        exception?.type === "AbortError" ||
        (exception?.value?.includes("AbortError") ?? false) ||
        (exception?.value?.includes("The operation was aborted") ?? false)
      ) {
        return null;
      }

      const frames = exception?.stacktrace?.frames;
      if (!frames || frames.length === 0) return event;
      const isExtensionFrame = (url: string) =>
        url.startsWith("chrome-extension://") ||
        url.startsWith("moz-extension://") ||
        url.startsWith("safari-web-extension://");
      const hasAppFrame = frames.some((f) => {
        const url = f.filename ?? "";
        return url !== "" && url !== "<anonymous>" && !isExtensionFrame(url);
      });
      return hasAppFrame ? event : null;
    }
  });

  // Upgrade opaque DOM resource-load rejections into actionable errors. A failed
  // <img>/<audio>/<video> load (or a third-party media player that wraps loading
  // in a promise, e.g. mux-player/hls.js) surfaces as an unhandled rejection whose
  // `reason` is a raw error `Event` with no stack - Sentry can only record the
  // non-actionable "Event (type=error) captured as promise rejection" (see #587).
  // Read the failing element's tag + URL and re-report a real Error so the source
  // is diagnosable; the beforeSend rule above drops the original opaque event.
  window.addEventListener("unhandledrejection", (event) => {
    const reason: unknown = event.reason;
    if (!(reason instanceof Event) || reason.type !== "error") {
      return;
    }
    const target = reason.target as (Element & { src?: string; currentSrc?: string; href?: string }) | null;
    const tag = target?.tagName.toLowerCase() ?? "unknown";
    const url = target?.currentSrc || target?.src || target?.href || "unknown";
    Sentry.captureException(new Error(`Resource load failed (unhandled rejection): <${tag}> ${url}`), {
      tags: { resource_tag: tag }
    });
  });
}

export const onRouterTransitionStart =
  process.env.NODE_ENV === "production" ? Sentry.captureRouterTransitionStart : () => {};
