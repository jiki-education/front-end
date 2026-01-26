import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  validateBlogConfig,
  validateArticleConfig,
  validateFrontmatter,
  validateAuthors,
  validateNoDuplicateSlugs
} from "@/lib/content/validator";
import authorsData from "../../../../content/src/authors.json";
import type { AuthorRegistry } from "@/lib/content/types";

const POSTS_DIR = path.join(__dirname, "..", "..", "..", "..", "content", "src", "posts");
const IMAGES_DIR = path.join(__dirname, "..", "..", "..", "..", "content", "images");
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

          it("should have config.json file", () => {
            const configFile = path.join(postDir, "config.json");
            expect(fs.existsSync(configFile)).toBe(true);
          });

          it("should have valid config.json", () => {
            const configFile = path.join(postDir, "config.json");
            const configContent = fs.readFileSync(configFile, "utf-8");
            const config = JSON.parse(configContent);

            expect(() => {
              validateBlogConfig(slug, config, authors, IMAGES_DIR);
            }).not.toThrow();
          });

          it("should have en.md file", () => {
            const enFile = path.join(postDir, "en.md");
            expect(fs.existsSync(enFile)).toBe(true);
          });

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));

          mdFiles.forEach((mdFile) => {
            const locale = path.basename(mdFile, ".md");

            it(`should have valid frontmatter (${locale})`, () => {
              const filePath = path.join(postDir, mdFile);
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const parsed = matter(fileContent);

              expect(() => {
                validateFrontmatter(slug, locale, parsed.data);
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

          it("should have config.json file", () => {
            const configFile = path.join(postDir, "config.json");
            expect(fs.existsSync(configFile)).toBe(true);
          });

          it("should have valid config.json", () => {
            const configFile = path.join(postDir, "config.json");
            const configContent = fs.readFileSync(configFile, "utf-8");
            const config = JSON.parse(configContent);

            expect(() => {
              validateArticleConfig(slug, config, authors);
            }).not.toThrow();
          });

          it("should have en.md file", () => {
            const enFile = path.join(postDir, "en.md");
            expect(fs.existsSync(enFile)).toBe(true);
          });

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));

          mdFiles.forEach((mdFile) => {
            const locale = path.basename(mdFile, ".md");

            it(`should have valid frontmatter (${locale})`, () => {
              const filePath = path.join(postDir, mdFile);
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const parsed = matter(fileContent);

              expect(() => {
                validateFrontmatter(slug, locale, parsed.data);
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
