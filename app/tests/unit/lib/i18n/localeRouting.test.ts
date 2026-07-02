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

    it("rewrites the concepts index and details", () => {
      expect(resolveLocaleRouting("/concepts")).toEqual({ action: "rewrite", target: "/en/concepts" });
      expect(resolveLocaleRouting("/concepts/loops")).toEqual({ action: "rewrite", target: "/en/concepts/loops" });
    });

    it("rewrites the single-page marketing routes", () => {
      expect(resolveLocaleRouting("/premium")).toEqual({ action: "rewrite", target: "/en/premium" });
      expect(resolveLocaleRouting("/roadmap")).toEqual({ action: "rewrite", target: "/en/roadmap" });
      expect(resolveLocaleRouting("/testimonials")).toEqual({ action: "rewrite", target: "/en/testimonials" });
    });

    it("rewrites the delete-account and unsubscribe flows", () => {
      expect(resolveLocaleRouting("/delete-account/confirm")).toEqual({
        action: "rewrite",
        target: "/en/delete-account/confirm"
      });
      expect(resolveLocaleRouting("/unsubscribe")).toEqual({ action: "rewrite", target: "/en/unsubscribe" });
      expect(resolveLocaleRouting("/unsubscribe/tok123")).toEqual({
        action: "rewrite",
        target: "/en/unsubscribe/tok123"
      });
    });

    it("rewrites the auth flow", () => {
      expect(resolveLocaleRouting("/auth/login")).toEqual({ action: "rewrite", target: "/en/auth/login" });
      expect(resolveLocaleRouting("/auth/signup")).toEqual({ action: "rewrite", target: "/en/auth/signup" });
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

    it("redirects /en/concepts and /en/concepts/loops to their naked URLs", () => {
      expect(resolveLocaleRouting("/en/concepts")).toEqual({ action: "redirect", target: "/concepts" });
      expect(resolveLocaleRouting("/en/concepts/loops")).toEqual({ action: "redirect", target: "/concepts/loops" });
    });

    it("redirects the marketing routes to their naked URLs", () => {
      expect(resolveLocaleRouting("/en/premium")).toEqual({ action: "redirect", target: "/premium" });
      expect(resolveLocaleRouting("/en/roadmap")).toEqual({ action: "redirect", target: "/roadmap" });
      expect(resolveLocaleRouting("/en/testimonials")).toEqual({ action: "redirect", target: "/testimonials" });
    });

    it("redirects the delete-account, unsubscribe and auth flows to their naked URLs", () => {
      expect(resolveLocaleRouting("/en/delete-account/confirm")).toEqual({
        action: "redirect",
        target: "/delete-account/confirm"
      });
      expect(resolveLocaleRouting("/en/unsubscribe/tok123")).toEqual({
        action: "redirect",
        target: "/unsubscribe/tok123"
      });
      expect(resolveLocaleRouting("/en/auth/login")).toEqual({ action: "redirect", target: "/auth/login" });
    });
  });

  describe("supported non-default locales (pass through to [locale])", () => {
    it("leaves /hu/blog untouched", () => {
      expect(resolveLocaleRouting("/hu/blog")).toEqual({ action: "none" });
    });

    it("leaves /hu/articles/my-article untouched", () => {
      expect(resolveLocaleRouting("/hu/articles/my-article")).toEqual({ action: "none" });
    });

    it("leaves /hu/concepts untouched", () => {
      expect(resolveLocaleRouting("/hu/concepts")).toEqual({ action: "none" });
    });

    it("leaves the localized home (/hu) untouched", () => {
      expect(resolveLocaleRouting("/hu")).toEqual({ action: "none" });
    });

    it("leaves /hu/auth/login untouched", () => {
      expect(resolveLocaleRouting("/hu/auth/login")).toEqual({ action: "none" });
    });
  });

  describe("apex home", () => {
    it("rewrites the naked home to the default-locale branch", () => {
      expect(resolveLocaleRouting("/")).toEqual({ action: "rewrite", target: "/en" });
    });

    it("redirects the explicit default-locale home to the naked apex", () => {
      expect(resolveLocaleRouting("/en")).toEqual({ action: "redirect", target: "/" });
    });
  });

  describe("non-localizable paths (untouched)", () => {
    it("leaves app routes alone", () => {
      expect(resolveLocaleRouting("/dashboard")).toEqual({ action: "none" });
      expect(resolveLocaleRouting("/settings")).toEqual({ action: "none" });
    });

    it("leaves a non-localizable locale-prefixed path alone", () => {
      expect(resolveLocaleRouting("/hu/dashboard")).toEqual({ action: "none" });
      expect(resolveLocaleRouting("/en/dashboard")).toEqual({ action: "none" });
    });
  });
});
