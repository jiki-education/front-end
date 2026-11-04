/**
 * Tests for the legacy subscriptions API client
 */

import { createPortalSession } from "@/lib/api/subscriptions";
import { api } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => {
  const actual = jest.requireActual("@/lib/api/client");
  return { ...actual, api: { post: jest.fn() } };
});

const mockedApiPost = api.post as jest.MockedFunction<typeof api.post>;

describe("createPortalSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates portal session successfully", async () => {
    const mockResponse = { data: { url: "https://billing.stripe.com/session/123" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const result = await createPortalSession();

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/subscriptions/portal_session");
    expect(result).toEqual({ url: "https://billing.stripe.com/session/123" });
  });

  it("propagates API errors", async () => {
    mockedApiPost.mockRejectedValue(new Error("No customer found"));

    await expect(createPortalSession()).rejects.toThrow("No customer found");
  });
});
