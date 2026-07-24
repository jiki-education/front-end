import {
  articleSchema,
  breadcrumbSchema,
  canonicalUrl,
  conceptLearningResourceSchema,
  courseSchema,
  organizationSchema,
  videoObjectSchema,
  websiteSchema
} from "@/lib/seo/schemas";

const SITE = "https://jiki.io";
const ORG_ID = `${SITE}/#organization`;

describe("canonicalUrl", () => {
  it("uses the naked path for the default locale", () => {
    expect(canonicalUrl("/concepts/arithmetic", "en")).toBe(`${SITE}/concepts/arithmetic`);
  });

  it("prefixes non-default locales", () => {
    expect(canonicalUrl("/concepts/arithmetic", "hu")).toBe(`${SITE}/hu/concepts/arithmetic`);
  });
});

describe("global entities", () => {
  it("links WebSite to the Organization by @id", () => {
    const org = organizationSchema();
    const site = websiteSchema("en");
    expect(org["@id"]).toBe(ORG_ID);
    expect(site.publisher).toEqual({ "@id": ORG_ID });
    expect(site.inLanguage).toBe("en");
  });
});

describe("breadcrumbSchema", () => {
  it("numbers items from 1 and resolves absolute item URLs", () => {
    const bc = breadcrumbSchema(
      [
        { name: "Blog", path: "/blog" },
        { name: "Hello", path: "/blog/hello" }
      ],
      "en"
    );
    expect(bc.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 2, name: "Hello", item: `${SITE}/blog/hello` }
    ]);
  });
});

describe("articleSchema", () => {
  it("emits a BlogPosting with a Person author and joined keywords", () => {
    const schema = articleSchema({
      type: "BlogPosting",
      path: "/blog/hello",
      locale: "en",
      headline: "Hello",
      description: "A post",
      datePublished: "2026-01-02",
      authorName: "iHiD",
      image: "/static/images/cover.png",
      keywords: ["a", "b"]
    });
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.url).toBe(`${SITE}/blog/hello`);
    expect(schema.mainEntityOfPage).toBe(`${SITE}/blog/hello`);
    expect(schema.author).toEqual({ "@type": "Person", name: "iHiD" });
    expect(schema.publisher).toEqual({ "@id": ORG_ID });
    expect(schema.keywords).toBe("a, b");
    expect(schema.image).toBe(`${SITE}/static/images/cover.png`);
  });

  it("falls back to the Organization author when no person is given", () => {
    const schema = articleSchema({
      type: "TechArticle",
      path: "/guides/x",
      locale: "en",
      headline: "Guide",
      description: "desc"
    });
    expect(schema.author).toEqual({ "@id": ORG_ID });
    expect(schema.image).toBeUndefined();
  });

  it("leaves already-absolute image URLs untouched", () => {
    const schema = articleSchema({
      type: "Article",
      path: "/help/x",
      locale: "en",
      headline: "H",
      description: "d",
      image: "https://cdn.example.com/a.png"
    });
    expect(schema.image).toBe("https://cdn.example.com/a.png");
  });
});

describe("videoObjectSchema", () => {
  it("builds a YouTube embed + thumbnail and ISO duration", () => {
    const schema = videoObjectSchema({
      path: "/projects/maze/episodes/intro",
      locale: "en",
      name: "Intro",
      description: "First episode",
      uploadDate: "2026-03-04",
      durationSeconds: 605,
      provider: "youtube",
      videoKey: "abc123",
      isAccessibleForFree: true
    });
    expect(schema["@type"]).toBe("VideoObject");
    expect(schema.embedUrl).toBe("https://www.youtube.com/embed/abc123");
    expect(schema.thumbnailUrl).toBe("https://img.youtube.com/vi/abc123/maxresdefault.jpg");
    expect(schema.duration).toBe("PT10M5S");
    expect(schema.url).toBe(`${SITE}/projects/maze/episodes/intro`);
    expect(schema.isAccessibleForFree).toBe(true);
    expect(schema).not.toHaveProperty("contentUrl");
  });

  it("builds a Mux player embed, stream contentUrl and image thumbnail", () => {
    const schema = videoObjectSchema({
      path: "/projects/maze/episodes/intro",
      locale: "en",
      name: "Intro",
      description: "First episode",
      uploadDate: "2026-03-04",
      durationSeconds: 30,
      provider: "mux",
      videoKey: "PLAY123"
    });
    expect(schema.embedUrl).toBe("https://player.mux.com/PLAY123");
    expect(schema.contentUrl).toBe("https://stream.mux.com/PLAY123.m3u8");
    expect(schema.thumbnailUrl).toBe("https://image.mux.com/PLAY123/thumbnail.jpg?width=1280&height=720");
    expect(schema.duration).toBe("PT30S");
    expect(schema).not.toHaveProperty("isAccessibleForFree");
  });

  it("prefers an explicit poster thumbnail when provided", () => {
    const schema = videoObjectSchema({
      path: "/p/e",
      locale: "en",
      name: "n",
      description: "d",
      uploadDate: "2026-01-01",
      provider: "mux",
      videoKey: "K",
      thumbnailUrl: "https://jiki.io/static/images/projects/episodes/poster.webp"
    });
    expect(schema.thumbnailUrl).toBe("https://jiki.io/static/images/projects/episodes/poster.webp");
    expect(schema).not.toHaveProperty("duration");
  });
});

describe("courseSchema", () => {
  it("describes a free online course made of its episodes", () => {
    const schema = courseSchema({
      path: "/projects/maze",
      locale: "en",
      name: "Maze",
      description: "Build a maze solver",
      image: "https://jiki.io/static/images/projects/covers/maze.png",
      episodes: [
        { name: "Intro", path: "/projects/maze/episodes/intro", description: "e1" },
        { name: "Loops", path: "/projects/maze/episodes/loops" }
      ]
    });
    expect(schema["@type"]).toBe("Course");
    expect(schema.provider).toEqual({ "@id": ORG_ID });
    expect(schema.hasCourseInstance.offers.price).toBe(0);
    expect(schema.hasPart).toHaveLength(2);
    expect(schema.hasPart[0]).toEqual({
      "@type": "CreativeWork",
      name: "Intro",
      url: `${SITE}/projects/maze/episodes/intro`,
      description: "e1"
    });
    expect(schema.hasPart[1]).not.toHaveProperty("description");
  });
});

describe("conceptLearningResourceSchema", () => {
  it("is a free LearningResource that teaches the concept", () => {
    const schema = conceptLearningResourceSchema(
      { slug: "arithmetic", title: "Arithmetic", description: "Numbers" },
      "en"
    );
    expect(schema["@type"]).toBe("LearningResource");
    expect(schema.url).toBe(`${SITE}/concepts/arithmetic`);
    expect(schema.teaches).toBe("Arithmetic");
    expect(schema.isAccessibleForFree).toBe(true);
  });
});
