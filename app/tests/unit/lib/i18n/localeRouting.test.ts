import { resolveLocaleRouting } from "@/lib/i18n/localeRouting";

describe("resolveLocaleRouting", () => {
  describe("naked localizable paths (rewrite to default-locale branch)", () => {
    it("rewrites the blog index", () => {
      expect(resolveLocaleRouting("/blog")).toEqual({ action: "rewrite", target: "/en/blog" });
    });

    it("rewrites blog posts", () => {
      expect(resolveLocaleRouting("/blog/my-post")).toEqual({ action: "rewrite", target: "/en/blog/my-post" });
    });

    it("rewrites the articles index and details", () => {
      expect(resolveLocaleRouting("/articles")).toEqual({ action: "rewrite", target: "/en/articles" });
      expect(resolveLocaleRouting("/articles/my-article")).toEqual({
        action: "rewrite",
        target: "/en/articles/my-article"
      });
    });
  });

  describe("explicit default-locale prefix (redirect to naked canonical URL)", () => {
    it("redirects /en/blog to /blog", () => {
      expect(resolveLocaleRouting("/en/blog")).toEqual({ action: "redirect", target: "/blog" });
    });

    it("redirects /en/blog/my-post to /blog/my-post", () => {
      expect(resolveLocaleRouting("/en/blog/my-post")).toEqual({ action: "redirect", target: "/blog/my-post" });
    });

    it("redirects /en/articles to /articles", () => {
      expect(resolveLocaleRouting("/en/articles")).toEqual({ action: "redirect", target: "/articles" });
    });
  });

  describe("supported non-default locales (pass through to [locale])", () => {
    it("leaves /hu/blog untouched", () => {
      expect(resolveLocaleRouting("/hu/blog")).toEqual({ action: "none" });
    });

    it("leaves /hu/articles/my-article untouched", () => {
      expect(resolveLocaleRouting("/hu/articles/my-article")).toEqual({ action: "none" });
    });
  });

  describe("non-localizable paths (untouched)", () => {
    it("leaves the landing page alone", () => {
      expect(resolveLocaleRouting("/")).toEqual({ action: "none" });
    });

    it("leaves naked non-localizable public pages alone", () => {
      expect(resolveLocaleRouting("/concepts")).toEqual({ action: "none" });
      expect(resolveLocaleRouting("/testimonials")).toEqual({ action: "none" });
      expect(resolveLocaleRouting("/premium")).toEqual({ action: "none" });
    });

    it("leaves app routes alone", () => {
      expect(resolveLocaleRouting("/dashboard")).toEqual({ action: "none" });
      expect(resolveLocaleRouting("/settings")).toEqual({ action: "none" });
    });

    it("does not redirect a bare default-locale segment", () => {
      expect(resolveLocaleRouting("/en")).toEqual({ action: "none" });
    });

    it("leaves a non-localizable locale-prefixed path alone", () => {
      expect(resolveLocaleRouting("/hu/dashboard")).toEqual({ action: "none" });
      expect(resolveLocaleRouting("/en/dashboard")).toEqual({ action: "none" });
    });
  });
});
