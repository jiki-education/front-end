// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://a267475ad61eb120ac13ecddd7379eb7@o4510766458601472.ingest.de.sentry.io/4510766459912272",
    tracesSampleRate: 0.1,
    enableLogs: true,
    sendDefaultPii: true
  });
}

export const onRouterTransitionStart =
  process.env.NODE_ENV === "production" ? Sentry.captureRouterTransitionStart : () => {};
