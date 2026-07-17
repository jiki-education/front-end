/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { isStaging } from "@/lib/env";

jest.mock("@/lib/env");

const mockIsStaging = isStaging as jest.MockedFunction<typeof isStaging>;

function requestFor(path: string) {
  return new NextRequest(new URL(`https://staging.jiki.io${path}`));
}

describe("middleware staging behaviour", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sets noindex and no-store on every staging response", () => {
    mockIsStaging.mockReturnValue(true);

    const res = middleware(requestFor("/"));

    expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("forces no-store on staging even for the favicon", () => {
    mockIsStaging.mockReturnValue(true);

    const res = middleware(requestFor("/favicon.ico"));

    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("never sets noindex on production and keeps the public cache header", () => {
    mockIsStaging.mockReturnValue(false);

    // "/" is an unauthenticated, cacheable public route.
    const res = middleware(requestFor("/"));

    expect(res.headers.get("X-Robots-Tag")).toBeNull();
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=600, s-maxage=600");
  });
});
