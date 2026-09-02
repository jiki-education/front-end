/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { exerciseLessonSlugs, videoLessonSlugs } from "@jiki/curriculum";
import { middleware } from "@/middleware";
import { isStaging } from "@/lib/env";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";

jest.mock("@/lib/env");

const mockIsStaging = isStaging as jest.MockedFunction<typeof isStaging>;

function requestFor(path: string, headers?: Record<string, string>) {
  return new NextRequest(new URL(`https://staging.jiki.io${path}`), { headers });
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

describe("middleware RSC cache headers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //
  // An RSC response is flight data served from the document's own URL, told apart
  // only by a request header Cloudflare doesn't vary on. If it is ever publicly
  // cacheable, an edge node can serve raw flight text to a browser asking for HTML.
  // These assert the header is set explicitly, not merely left unset.
  //
  it("marks an RSC response uncacheable on a cacheable public route", () => {
    mockIsStaging.mockReturnValue(false);

    const res = middleware(requestFor("/", { rsc: "1" }));

    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("marks an RSC response uncacheable with no `_rsc` cache-buster in the URL", () => {
    mockIsStaging.mockReturnValue(false);

    // The buster is what normally keeps prefetches off the document's cache key.
    // Its absence is exactly the case this guard exists for.
    const res = middleware(requestFor("/blog", { rsc: "1" }));

    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("still serves the public cache header to a document request on the same route", () => {
    mockIsStaging.mockReturnValue(false);

    const res = middleware(requestFor("/"));

    expect(res.headers.get("Cache-Control")).toBe("public, max-age=600, s-maxage=600");
  });

  it("keeps staging's no-store for RSC requests", () => {
    mockIsStaging.mockReturnValue(true);

    const res = middleware(requestFor("/", { rsc: "1" }));

    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});

describe("middleware public-exercise redirect", () => {
  //
  // A signed-out visitor who follows a link to an exercise lesson should land on
  // that exercise's public page rather than on the login form. Only exercise
  // lessons have such a page; every other lesson type keeps the login bounce.
  //
  const exerciseSlug = exerciseLessonSlugs[0];
  const videoSlug = videoLessonSlugs[0];

  beforeEach(() => {
    mockIsStaging.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sends a signed-out visitor from an exercise lesson to its public page", () => {
    const res = middleware(requestFor(`/lesson/${exerciseSlug}`));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("Location")!).pathname).toBe(`/exercises/${exerciseSlug}`);
  });

  it("never caches that redirect, since which page the URL serves is a property of the visitor", () => {
    const res = middleware(requestFor(`/lesson/${exerciseSlug}`));

    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(res.headers.get("Vary")).toBe("Cookie");
  });

  it("leaves a signed-in visitor on the lesson", () => {
    const res = middleware(requestFor(`/lesson/${exerciseSlug}`, { cookie: `${AUTHENTICATION_COOKIE_NAME}=42` }));

    expect(res.headers.get("Location")).toBeNull();
  });

  it("leaves a video lesson alone, as it has no public page to send them to", () => {
    const res = middleware(requestFor(`/lesson/${videoSlug}`));

    expect(res.headers.get("Location")).toBeNull();
  });

  it("leaves an unknown lesson slug alone", () => {
    const res = middleware(requestFor("/lesson/not-a-real-lesson"));

    expect(res.headers.get("Location")).toBeNull();
  });
});
