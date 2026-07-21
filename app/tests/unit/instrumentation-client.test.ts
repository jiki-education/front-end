// Verifies the noise filters wired into Sentry's client init. We mock Sentry.init
// to capture the config it's given, then assert that the ignoreErrors matchers
// catch the specific noise messages while leaving genuine, similar-looking errors
// (e.g. our own HTTP-status fetch failures) reportable.

type IgnoreMatcher = string | RegExp;

const capturedInit: { options?: { ignoreErrors?: IgnoreMatcher[] } } = {};

jest.mock("@sentry/nextjs", () => ({
  init: (options: { ignoreErrors?: IgnoreMatcher[] }) => {
    capturedInit.options = options;
  },
  captureException: jest.fn(),
  captureRouterTransitionStart: jest.fn()
}));

// Replicates how Sentry's ignoreErrors decides whether a message is dropped: a
// string entry is a substring match, a RegExp entry is a `.test()` match.
function isIgnored(message: string, matchers: IgnoreMatcher[]): boolean {
  return matchers.some((m) => (typeof m === "string" ? message.includes(m) : m.test(message)));
}

describe("instrumentation-client Sentry ignoreErrors", () => {
  let ignoreErrors: IgnoreMatcher[];

  beforeAll(async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    // Sentry.init only runs in production, so force it for this import.
    Object.defineProperty(process.env, "NODE_ENV", { value: "production", configurable: true });
    await jest.isolateModulesAsync(async () => {
      await import("@/instrumentation-client");
    });
    Object.defineProperty(process.env, "NODE_ENV", { value: originalNodeEnv, configurable: true });
    ignoreErrors = capturedInit.options?.ignoreErrors ?? [];
  });

  it("initialises Sentry with an ignoreErrors list", () => {
    expect(ignoreErrors.length).toBeGreaterThan(0);
  });

  // JIKI-FRONT-END-5 (Chromium) and JIKI-FRONT-END-9 (Firefox): transient
  // client-side fetch failures where the request never completed.
  it("ignores transient fetch failures (Chromium and Firefox wording)", () => {
    expect(isIgnored("Failed to fetch", ignoreErrors)).toBe(true);
    expect(isIgnored("NetworkError when attempting to fetch resource.", ignoreErrors)).toBe(true);
  });

  it("still reports our own HTTP-status fetch errors", () => {
    // externalPricing.ts throws this on a real server error; the anchored matcher
    // must not swallow it.
    expect(isIgnored("Failed to fetch external pricing (500)", ignoreErrors)).toBe(false);
  });

  // JIKI-FRONT-END-3V: extension/password-manager patching the WebAuthn API.
  it("ignores the WebAuthn non-configurable-property redefinition", () => {
    expect(
      isIgnored('TypeError: can\'t redefine non-configurable property "isConditionalMediationAvailable"', ignoreErrors)
    ).toBe(true);
  });

  // JIKI-FRONT-END-3T: Firefox-internal media/network abort.
  it("ignores the Firefox internal input-stream error", () => {
    expect(isIgnored("Error in input stream", ignoreErrors)).toBe(true);
  });

  it("does not ignore unrelated genuine errors", () => {
    expect(isIgnored("Cannot read properties of undefined (reading 'user')", ignoreErrors)).toBe(false);
    expect(isIgnored("Something in the input stream broke unexpectedly for real", ignoreErrors)).toBe(false);
  });
});
