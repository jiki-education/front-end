import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { validateFrontmatter, validateAuthors, validateNoDuplicateSlugs } from "../src/validator.js";
import authorsData from "../src/authors.json" with { type: "json" };
import type { AuthorRegistry } from "../src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_DIR = path.join(__dirname, "..", "src", "posts");
const IMAGES_DIR = path.join(__dirname, "..", "images");
const authors = authorsData as AuthorRegistry;

describe("Content Validation", () => {
  describe("Authors", () => {
    it("should have valid authors.json", () => {
      expect(() => {
        validateAuthors(authors, IMAGES_DIR);
      }).not.toThrow();
    });
  });

  describe("Blog Posts", () => {
    const blogDir = path.join(POSTS_DIR, "blog");

    if (fs.existsSync(blogDir)) {
      const slugDirs = fs.readdirSync(blogDir).filter((item) => {
        return fs.statSync(path.join(blogDir, item)).isDirectory();
      });

      slugDirs.forEach((slug) => {
        describe(`Blog post: ${slug}`, () => {
          const postDir = path.join(blogDir, slug);

          it("should have en.md file", () => {
            const enFile = path.join(postDir, "en.md");
            expect(fs.existsSync(enFile), `Missing en.md for blog post '${slug}'`).toBe(true);
          });

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));

          mdFiles.forEach((mdFile) => {
            const locale = path.basename(mdFile, ".md");

            it(`should have valid frontmatter (${locale})`, () => {
              const filePath = path.join(postDir, mdFile);
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const parsed = matter(fileContent);

              expect(() => {
                validateFrontmatter(slug, parsed.data, authors, IMAGES_DIR);
              }).not.toThrow();
            });
          });
        });
      });
    }
  });

  describe("Articles", () => {
    const articlesDir = path.join(POSTS_DIR, "articles");

    if (fs.existsSync(articlesDir)) {
      const slugDirs = fs.readdirSync(articlesDir).filter((item) => {
        return fs.statSync(path.join(articlesDir, item)).isDirectory();
      });

      slugDirs.forEach((slug) => {
        describe(`Article: ${slug}`, () => {
          const postDir = path.join(articlesDir, slug);

          it("should have en.md file", () => {
            const enFile = path.join(postDir, "en.md");
            expect(fs.existsSync(enFile), `Missing en.md for article '${slug}'`).toBe(true);
          });

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));

          mdFiles.forEach((mdFile) => {
            const locale = path.basename(mdFile, ".md");

            it(`should have valid frontmatter (${locale})`, () => {
              const filePath = path.join(postDir, mdFile);
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const parsed = matter(fileContent);

              expect(() => {
                validateFrontmatter(slug, parsed.data, authors, IMAGES_DIR);
              }).not.toThrow();
            });
          });
        });
      });
    }
  });

  describe("Slug Uniqueness", () => {
    it("should have no duplicate slugs across blog and articles", () => {
      const allSlugs: string[] = [];

      // Collect blog slugs
      const blogDir = path.join(POSTS_DIR, "blog");
      if (fs.existsSync(blogDir)) {
        const blogSlugs = fs.readdirSync(blogDir).filter((item) => {
          return fs.statSync(path.join(blogDir, item)).isDirectory();
        });
        allSlugs.push(...blogSlugs);
      }

      // Collect article slugs
      const articlesDir = path.join(POSTS_DIR, "articles");
      if (fs.existsSync(articlesDir)) {
        const articleSlugs = fs.readdirSync(articlesDir).filter((item) => {
          return fs.statSync(path.join(articlesDir, item)).isDirectory();
        });
        allSlugs.push(...articleSlugs);
      }

      expect(() => {
        validateNoDuplicateSlugs(allSlugs);
      }).not.toThrow();
    });
  });
});
