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
      "Object Not Found Matching Id",

      // WebExtension messaging errors: a content script talking to an unloaded
      // background page, or a Safari extension losing its tab. These bubble into
      // the page with no stack, so only a message filter can catch them.
      "Could not establish connection. Receiving end does not exist.",
      "Invalid call to runtime.sendMessage(). Tab not found.",

      // Crypto-wallet extensions erroring in their own injected page-context code.
      "Failed to connect to MetaMask",
      "MetaMask extension not found",
      /trap returned falsish for property 'tronlinkParams'/,

      // Instagram's Android in-app webview loses the Java bridge for its own
      // navigation-performance logger.
      /Java object is gone/,

      // Mux Data analytics beacons blocked by adblockers; mux-embed re-queues
      // internally, so a failed beacon flush is never actionable.
      /Failed to fetch \((?:[a-z0-9-]+\.)?litix\.io\)/,

      // Google Translate (and similar DOM-rewriting tools) replaces text nodes out
      // from under React, so the commit phase can no longer find its children. The
      // stacks are 100% react-dom internals with no app frames.
      /Failed to execute 'removeChild' on 'Node'/,
      /Failed to execute 'insertBefore' on 'Node'/,

      // The RSC flight stream was cut mid-read: the user navigated away, closed
      // the tab, or dropped network during a soft navigation.
      "Connection closed.",

      // A script download truncated by a dropped connection.
      "Unexpected end of script",

      // Transient client-side fetch failures where the request never completed:
      // the user navigated away mid-request, a mobile connection dropped, the device
      // was offline, or an ad/tracking blocker killed the request. These carry no
      // HTTP status and are not server bugs. Anchored so our own explicit
      // HTTP-status errors — e.g. "Failed to fetch external pricing (500)" from
      // lib/api/externalPricing.ts — still report.
      // JIKI-FRONT-END-5 (Chromium wording, 423 events / 162 users).
      /^Failed to fetch$/,
      // JIKI-FRONT-END-9 (Firefox wording of the same failure, 40 events / 40 users).
      /^NetworkError when attempting to fetch resource\.$/,

      // A browser extension / password manager patches the WebAuthn API and tries to
      // redefine a non-configurable property. Origin is <anonymous code>, not ours.
      // JIKI-FRONT-END-3V (1 event, Firefox).
      /can't redefine non-configurable property "isConditionalMediationAvailable"/,

      // Firefox-internal media/network abort with no stack trace, raised from the
      // browser's own input-stream handling rather than our code.
      // JIKI-FRONT-END-3T (1 event, Firefox).
      /^Error in input stream$/,

      // Injected document-level touch handlers; no first-party code reads .touches
      // (the scrubber uses pointer/mouse events).
      "Cannot read properties of undefined (reading 'touches')",

      // Chrome-on-iOS injected code rejects with two-letter minified messages
      // ("Aa", "he"). No real app error has a two-character message.
      /^[A-Za-z]{2}$/,

      // Autoplay being denied by the browser is expected behaviour, not a bug.
      /play method is not allowed by the user agent/,

      // media-chrome touching an extension-injected cross-origin stylesheet.
      /Not allowed to access cross-origin stylesheet/,

      // Firefox (Gecko) internal error in media-chrome's scrubber preview thumbnail.
      /^NS_ERROR_NOT_AVAILABLE/,

      // Our CSP correctly blocking injected/extension scripts from eval'ing.
      // First-party code never evals, so this can only come from foreign scripts.
      "violates the following Content Security Policy directive",

      // Canonical benign browser warning: the observer needed another pass within
      // one frame; the browser recovers and nothing is broken.
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications."
    ],
    beforeSend(event) {
      const exception = event.exception?.values?.[0];
      // Opaque DOM resource-load rejections. A failed <img>/<audio>/<video> load
      // (or a media player that wraps loading in a promise) rejects with a raw
      // `Event` of type "error" that carries no stack, so Sentry can only record
      // the useless "Event `Event` (type=error) captured as promise rejection".
      // We re-capture these as a real Error with the failing resource URL in the
      // unhandledrejection listener below, so drop the stackless originals here.
      // Extensions also re-dispatch synthetic CustomEvents that Sentry captures
      // the same way; any raw DOM Event captured as a rejection reason is
      // non-actionable by construction.
      if (
        (exception?.type === "Event" || exception?.type === "CustomEvent") &&
        ((exception.value?.includes("(type=error)") ?? false) ||
          (exception.value?.includes("captured as promise rejection") ?? false))
      ) {
        return null;
      }
      // Drop aborted-request errors - these happen when the user navigates away
      // while a fetch is still in flight, which is expected, not a bug.
      if (
        exception?.type === "RequestAbortedError" ||
        exception?.type === "AbortError" ||
        (exception?.value?.includes("AbortError") ?? false) ||
        (exception?.value?.includes("The operation was aborted") ?? false)
      ) {
        return null;
      }
      // Wallet extensions (MetaMask et al) reject with a plain object rather than
      // an Error, so the event has no exception stack; the extension's own stack
      // and error code only exist inside the serialized rejection reason.
      const serialized = event.extra?.__serialized__ as { code?: number; message?: string; stack?: string } | undefined;
      if (
        serialized?.code === 4900 ||
        (serialized?.message?.includes("provider is disconnected from all chains") ?? false) ||
        (serialized?.stack?.includes("chrome-extension://") ?? false)
      ) {
        return null;
      }

      const frames = exception?.stacktrace?.frames;
      if (!frames || frames.length === 0) return event;

      // Page-context injected scripts (adware/extension fetch wrappers) re-wrap
      // window.fetch and leave a dangling promise copy, so fetch failures our code
      // (or Mux, or Next's router prefetch) already handles resurface as unhandled
      // rejections. Real Next.js frames can sit above the wrapper frame, so this
      // must be an any-frame check, and the Google Search iOS in-app browser
      // injects a page-inspection script (at the document's own URL, so it looks
      // like an app frame) that recurses to stack overflow.
      const INJECTED_FILE_PATTERNS = [/\/frame_ant\/frame_ant\.js/, /injectScriptAdjust\.js/, /\bactiveContent\.js/];
      const INJECTED_FUNCTIONS = new Set(["findTopmostVisibleElement", "checkForImage", "isOpaqueElement"]);
      if (
        frames.some(
          (f) =>
            INJECTED_FILE_PATTERNS.some((p) => p.test(f.filename ?? "")) || INJECTED_FUNCTIONS.has(f.function ?? "")
        )
      ) {
        return null;
      }

      // Keep an event only if some frame is genuinely our code. In the browser our
      // frames are always chunk/static URLs (https://jiki.io/_next/... or
      // https://assets.jiki.io/_next/...). Extension content scripts injected into
      // the page context show up as bare sourceURL names ("inpage.js",
      // "extensionServiceWorker.js", "content/foo.js"), the document URL itself,
      // "undefined", or <anonymous> - none of which are our bundle. webpack:// is
      // kept for any environment that reports pre-symbolicated frames.
      const isAppFrame = (url: string) =>
        url.includes("/_next/") || url.includes("jiki.io/static/") || url.startsWith("webpack://");
      const hasAppFrame = frames.some((f) => isAppFrame(f.filename ?? ""));
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
    // Only media loads (mux-player/hls.js, images, audio) are worth diagnosing here (see #587).
    // A failed <link> stylesheet or <script> chunk load is transient CDN/network noise - a user
    // on a flaky connection, or an old page after a deploy replaced the fingerprinted asset - not
    // an actionable app bug, and the error Event carries no HTTP status to tell 404 from a dropped
    // connection anyway. Don't re-report those.
    if (tag !== "img" && tag !== "audio" && tag !== "video") {
      return;
    }
    const url = target?.currentSrc || target?.src || target?.href || "unknown";
    Sentry.captureException(new Error(`Resource load failed (unhandled rejection): <${tag}> ${url}`), {
      tags: { resource_tag: tag }
    });
  });
}

export const onRouterTransitionStart =
  process.env.NODE_ENV === "production" ? Sentry.captureRouterTransitionStart : () => {};
