import sitemap from "@/app/sitemap";
import { publishedExerciseSlugs } from "@/lib/exercises/published";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";
import { hreflangLocale } from "@/lib/seo/alternates";

jest.mock("@/lib/content/getAllBlogPosts", () => ({
  getAllBlogPosts: jest.fn().mockResolvedValue([{ slug: "hello", date: "2026-01-01" }])
}));
jest.mock("@/lib/content/getAllArticles", () => ({
  getAllArticles: jest.fn().mockResolvedValue([
    { slug: "listed", date: "2026-01-01", listed: true },
    { slug: "unlisted", date: "2026-01-01", listed: false }
  ])
}));
jest.mock("@/lib/content/getAllGuides", () => ({
  getAllGuides: jest.fn().mockResolvedValue([
    { slug: "free", date: "2026-01-01", premium: false },
    { slug: "paid", date: "2026-01-01", premium: true }
  ])
}));
jest.mock("@/lib/content/getAllProjects", () => ({
  getAllProjects: jest.fn().mockResolvedValue([
    { slug: "shipped", episodeCount: 3 },
    { slug: "coming-soon", episodeCount: 0 }
  ])
}));
jest.mock("@/lib/concepts/server-concepts", () => ({
  getAllConceptsServer: jest.fn().mockResolvedValue([{ slug: "variables" }])
}));

describe("sitemap", () => {
  it("emits one <url> per locale for every page", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const locale of SUPPORTED_LOCALES) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      expect(urls).toContain(`${SITE_URL}${prefix}/blog/hello`);
    }
    expect(urls.filter((url) => url.endsWith("/blog/hello"))).toHaveLength(SUPPORTED_LOCALES.length);
  });

  it("gives every entry a self-referencing alternate", async () => {
    for (const entry of await sitemap()) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.values(languages)).toContain(entry.url);
    }
  });

  it("gives every entry the same full alternates map, including x-default", async () => {
    const expectedKeys = ["x-default", ...SUPPORTED_LOCALES.map(hreflangLocale)].sort();
    for (const entry of await sitemap()) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.keys(languages).sort()).toEqual(expectedKeys);
    }
  });

  it("lists published exercises and no others", async () => {
    const urls = new Set((await sitemap()).map((entry) => entry.url));
    const published = publishedExerciseSlugs();

    expect(published.length).toBeGreaterThan(0);
    for (const slug of published) {
      expect(urls).toContain(`${SITE_URL}/exercises/${slug}`);
    }

    const listed = [...urls].filter((url) => url.includes("/exercises/"));
    expect(listed).toHaveLength(published.length * SUPPORTED_LOCALES.length);
  });

  it("omits premium guides, unlisted articles and episode-less projects", async () => {
    const urls = new Set((await sitemap()).map((entry) => entry.url));
    expect(urls).toContain(`${SITE_URL}/guides/free`);
    expect(urls).not.toContain(`${SITE_URL}/guides/paid`);
    expect(urls).not.toContain(`${SITE_URL}/help/unlisted`);
    expect(urls).not.toContain(`${SITE_URL}/projects/coming-soon`);
  });

  it("has no duplicate URLs", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
