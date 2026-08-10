import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  validateBlogConfig,
  validateArticleConfig,
  validateGuideConfig,
  validateFrontmatter,
  validateAuthors,
  validateNoDuplicateSlugs,
  validateEnglishSource,
  validateProjectConfigIsStructural,
  validateProjectCopyCatalog,
  validateEpisodeSummary,
  validateTestimonials
} from "@/lib/content/validator";
import authorsData from "../../../../content/src/authors.json";
import type { AuthorRegistry } from "@/lib/content/types";

const POSTS_DIR = path.join(__dirname, "..", "..", "..", "..", "content", "src", "posts");
const IMAGES_DIR = path.join(__dirname, "..", "..", "..", "..", "content", "images");
const authors = authorsData as AuthorRegistry;

// English content is authored in source.md (the source of truth); map that
// filename to the "en" locale. Any other file is named <locale>.md.
function localeFromMdFile(file: string): string {
  const base = path.basename(file, ".md");
  return base === "source" ? "en" : base;
}

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

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));
          const existingLocales = mdFiles.map((f) => localeFromMdFile(f));

          it("should have an English source file", () => {
            expect(() => {
              validateEnglishSource("blog", slug, postDir, existingLocales);
            }).not.toThrow();
          });

          mdFiles.forEach((mdFile) => {
            const locale = localeFromMdFile(mdFile);

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

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));
          const existingLocales = mdFiles.map((f) => localeFromMdFile(f));

          it("should have an English source file", () => {
            expect(() => {
              validateEnglishSource("article", slug, postDir, existingLocales);
            }).not.toThrow();
          });

          mdFiles.forEach((mdFile) => {
            const locale = localeFromMdFile(mdFile);

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

  describe("Guides", () => {
    const guidesDir = path.join(POSTS_DIR, "guides");

    if (fs.existsSync(guidesDir)) {
      const slugDirs = fs.readdirSync(guidesDir).filter((item) => {
        return fs.statSync(path.join(guidesDir, item)).isDirectory();
      });

      slugDirs.forEach((slug) => {
        describe(`Guide: ${slug}`, () => {
          const postDir = path.join(guidesDir, slug);

          it("should have config.json file", () => {
            const configFile = path.join(postDir, "config.json");
            expect(fs.existsSync(configFile)).toBe(true);
          });

          it("should have valid config.json", () => {
            const configFile = path.join(postDir, "config.json");
            const configContent = fs.readFileSync(configFile, "utf-8");
            const config = JSON.parse(configContent);

            expect(() => {
              validateGuideConfig(slug, config, IMAGES_DIR);
            }).not.toThrow();
          });

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));
          const existingLocales = mdFiles.map((f) => localeFromMdFile(f));

          it("should have an English source file", () => {
            expect(() => {
              validateEnglishSource("guide", slug, postDir, existingLocales);
            }).not.toThrow();
          });

          mdFiles.forEach((mdFile) => {
            const locale = localeFromMdFile(mdFile);

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

  describe("Projects", () => {
    const projectsDir = path.join(POSTS_DIR, "projects");

    if (fs.existsSync(projectsDir)) {
      const projectSlugs = fs.readdirSync(projectsDir).filter((item) => {
        return fs.statSync(path.join(projectsDir, item)).isDirectory();
      });

      // Learner-facing project copy is a catalog, not per-project config: English
      // here, every other locale published by the i18n repo.
      it("should have a valid English copy catalog", () => {
        const listedSlugs = JSON.parse(fs.readFileSync(path.join(projectsDir, "config.json"), "utf-8"))
          .projects as string[];
        const catalog = JSON.parse(fs.readFileSync(path.join(projectsDir, "messages.json"), "utf-8"));

        expect(() => {
          validateProjectCopyCatalog(catalog, listedSlugs);
        }).not.toThrow();
      });

      projectSlugs.forEach((slug) => {
        describe(`Project: ${slug}`, () => {
          const projectDir = path.join(projectsDir, slug);

          it("should have config.json file", () => {
            const configFile = path.join(projectDir, "config.json");
            expect(fs.existsSync(configFile)).toBe(true);
          });

          it("should have a config.json holding structure only", () => {
            const configFile = path.join(projectDir, "config.json");
            const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));

            expect(() => {
              validateProjectConfigIsStructural(slug, config);
            }).not.toThrow();
          });

          // Episodes live in UUID-named subdirectories, each with a config.json.
          const episodeDirs = fs.readdirSync(projectDir).filter((item) => {
            const itemPath = path.join(projectDir, item);
            return fs.statSync(itemPath).isDirectory() && fs.existsSync(path.join(itemPath, "config.json"));
          });

          episodeDirs.forEach((episodeId) => {
            describe(`Episode: ${episodeId}`, () => {
              const episodeDir = path.join(projectDir, episodeId);
              const mdFiles = fs.readdirSync(episodeDir).filter((f) => f.endsWith(".md"));
              const existingLocales = mdFiles.map((f) => localeFromMdFile(f));

              it("should have an English source file", () => {
                expect(() => {
                  validateEnglishSource("episode", episodeId, episodeDir, existingLocales);
                }).not.toThrow();
              });

              it("should have a well-formed summary block if source.md has one", () => {
                const parsed = matter(fs.readFileSync(path.join(episodeDir, "source.md"), "utf-8"));
                const summary = (parsed.data as Record<string, unknown>).summary;

                expect(() => {
                  validateEpisodeSummary(episodeId, summary);
                }).not.toThrow();
              });
            });
          });
        });
      });
    }
  });

  describe("Slug Uniqueness", () => {
    it("should have no duplicate slugs across blog, articles, and guides", () => {
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

      // Collect guide slugs
      const guidesDir = path.join(POSTS_DIR, "guides");
      if (fs.existsSync(guidesDir)) {
        const guideSlugs = fs.readdirSync(guidesDir).filter((item) => {
          return fs.statSync(path.join(guidesDir, item)).isDirectory();
        });
        allSlugs.push(...guideSlugs);
      }

      expect(() => {
        validateNoDuplicateSlugs(allSlugs);
      }).not.toThrow();
    });
  });

  describe("Testimonials", () => {
    const testimonialsDir = path.join(__dirname, "..", "..", "..", "..", "content", "src", "testimonials");

    describe("en.json", () => {
      const filePath = path.join(testimonialsDir, "en.json");

      it("should exist", () => {
        expect(fs.existsSync(filePath)).toBe(true);
      });

      it("should be valid", () => {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        expect(() => validateTestimonials("en", data)).not.toThrow();
      });
    });
  });
});
