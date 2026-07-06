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
}

export const onRouterTransitionStart =
  process.env.NODE_ENV === "production" ? Sentry.captureRouterTransitionStart : () => {};
