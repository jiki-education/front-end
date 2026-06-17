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
    beforeSend(event) {
      const frames = event.exception?.values?.[0]?.stacktrace?.frames;
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
