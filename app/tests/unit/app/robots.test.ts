import robots from "@/app/robots";
import { isStaging } from "@/lib/env";

jest.mock("@/lib/env");

const mockIsStaging = isStaging as jest.MockedFunction<typeof isStaging>;

describe("robots", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("allows all crawling and lists the sitemap in production", () => {
    mockIsStaging.mockReturnValue(false);

    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://jiki.io/sitemap.xml");
  });

  it("blocks everything and omits the sitemap on staging", () => {
    mockIsStaging.mockReturnValue(true);

    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(result.sitemap).toBeUndefined();
  });
});
