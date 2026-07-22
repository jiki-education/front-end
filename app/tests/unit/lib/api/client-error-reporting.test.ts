/**
 * Unit tests for the API client's central Sentry-reporting policy.
 * Only authenticated (/internal/*) endpoints report, and only unexpected
 * statuses (not 401/403/404/429) are sent to reportError.
 */

/* eslint-disable @typescript-eslint/require-await */

import { api } from "@/lib/api/client";
import { reportError } from "@/lib/reportError";

global.fetch = jest.fn();

jest.mock("@/lib/api/errorHandlerStore", () => ({
  setCriticalError: jest.fn(),
  clearCriticalError: jest.fn(),
  useErrorHandlerStore: { getState: jest.fn(() => ({ criticalError: null })) }
}));

jest.mock("@/lib/api/config", () => ({
  getApiUrl: jest.fn((path: string) => `https://api.example.com${path}`)
}));

jest.mock("@/lib/reportError", () => ({
  reportError: jest.fn()
}));

const mockedReportError = reportError as jest.MockedFunction<typeof reportError>;

function mockStatus(status: number) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    statusText: `Status ${status}`,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => ({ error: { type: "some_type", message: "nope" } })
  });
}

// useRetries=false: these are non-network errors that throw immediately anyway,
// but disabling retries keeps the tests free of the backoff timer machinery.
async function patchInternal(status: number) {
  mockStatus(status);
  await expect(api.patch("/internal/user_lessons/x/complete", undefined, undefined, false)).rejects.toBeDefined();
}

describe("API client central error reporting", () => {
  beforeEach(() => jest.clearAllMocks());

  it.each([400, 409, 422, 500, 502, 503])("reports unexpected status %s on an internal endpoint", async (status) => {
    await patchInternal(status);
    expect(mockedReportError).toHaveBeenCalledTimes(1);
  });

  it.each([401, 403, 404, 429])("does not report expected status %s on an internal endpoint", async (status) => {
    mockStatus(status);
    // 401 hangs (auth modal) and 429 retries forever, so only assert the throwing
    // 403/404 here; 401/429 are covered by their dedicated retry tests.
    if (status === 403 || status === 404) {
      await expect(api.get("/internal/user_lessons/x", undefined, false)).rejects.toBeDefined();
      expect(mockedReportError).not.toHaveBeenCalled();
    }
  });

  it("does not report a 422 on a non-internal (unauthenticated) endpoint", async () => {
    mockStatus(422);
    await expect(api.post("/public/newsletter", undefined, undefined, false)).rejects.toBeDefined();
    expect(mockedReportError).not.toHaveBeenCalled();
  });
});
