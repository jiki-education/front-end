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
  validateRequiredLocales,
  validateProjectRequiredLocales,
  validateEpisodeSummaryParity,
  validateTestimonials,
  REQUIRED_LOCALES
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

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));
          const existingLocales = mdFiles.map((f) => path.basename(f, ".md"));

          it("should have all required locale files", () => {
            expect(() => {
              validateRequiredLocales("blog", slug, postDir, existingLocales);
            }).not.toThrow();
          });

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

          const mdFiles = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));
          const existingLocales = mdFiles.map((f) => path.basename(f, ".md"));

          it("should have all required locale files", () => {
            expect(() => {
              validateRequiredLocales("article", slug, postDir, existingLocales);
            }).not.toThrow();
          });

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
          const existingLocales = mdFiles.map((f) => path.basename(f, ".md"));

          it("should have all required locale files", () => {
            expect(() => {
              validateRequiredLocales("guide", slug, postDir, existingLocales);
            }).not.toThrow();
          });

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

  describe("Projects", () => {
    const projectsDir = path.join(POSTS_DIR, "projects");

    if (fs.existsSync(projectsDir)) {
      const projectSlugs = fs.readdirSync(projectsDir).filter((item) => {
        return fs.statSync(path.join(projectsDir, item)).isDirectory();
      });

      projectSlugs.forEach((slug) => {
        describe(`Project: ${slug}`, () => {
          const projectDir = path.join(projectsDir, slug);

          it("should have config.json file", () => {
            const configFile = path.join(projectDir, "config.json");
            expect(fs.existsSync(configFile)).toBe(true);
          });

          it("should have all required locale keys in config.json", () => {
            const configFile = path.join(projectDir, "config.json");
            const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));

            expect(() => {
              validateProjectRequiredLocales(slug, config);
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
              const existingLocales = mdFiles.map((f) => path.basename(f, ".md"));

              it("should have all required locale files", () => {
                expect(() => {
                  validateRequiredLocales("episode", episodeId, episodeDir, existingLocales);
                }).not.toThrow();
              });

              it("should have a summary block in every locale if en.md has one", () => {
                const localeSummaries: Record<string, unknown> = {};
                for (const mdFile of mdFiles) {
                  const locale = path.basename(mdFile, ".md");
                  const parsed = matter(fs.readFileSync(path.join(episodeDir, mdFile), "utf-8"));
                  localeSummaries[locale] = (parsed.data as Record<string, unknown>).summary;
                }

                expect(() => {
                  validateEpisodeSummaryParity(episodeId, localeSummaries);
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

    for (const locale of REQUIRED_LOCALES) {
      describe(`${locale}.json`, () => {
        const filePath = path.join(testimonialsDir, `${locale}.json`);

        it("should exist", () => {
          expect(fs.existsSync(filePath)).toBe(true);
        });

        it("should be valid", () => {
          const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          expect(() => validateTestimonials(locale, data)).not.toThrow();
        });
      });
    }

    it("should have identical quote slugs across all locales", () => {
      const slugsByLocale = REQUIRED_LOCALES.map((locale) => {
        const data = JSON.parse(fs.readFileSync(path.join(testimonialsDir, `${locale}.json`), "utf-8"));
        return (data.quotes as Array<{ slug: string }>).map((q) => q.slug);
      });
      for (const slugs of slugsByLocale) {
        expect(slugs).toEqual(slugsByLocale[0]);
      }
    });
  });
});
