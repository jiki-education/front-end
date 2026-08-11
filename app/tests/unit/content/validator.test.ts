import {
  validateBlogConfig,
  validateArticleConfig,
  validateFrontmatter,
  validateAuthors,
  validateNoDuplicateSlugs,
  validateTestimonials,
  validateEnglishSource,
  validateProjectConfigIsStructural,
  validateProjectCopyCatalog,
  validateEpisodeSummary,
  ValidationError
} from "@/lib/content/validator";
import type { AuthorRegistry } from "@/lib/content/types";
import path from "path";

const IMAGES_DIR = path.join(__dirname, "..", "..", "..", "..", "content", "images");

const validAuthors: AuthorRegistry = {
  ihid: {
    name: "Jeremy Walker",
    avatar: "/images/avatars/ihid.webp"
  }
};

const validBlogConfig = {
  date: "2025-01-15",
  author: "ihid",
  featured: false,
  coverImage: "/images/blog/hello-world.webp"
};

const validArticleConfig = {
  date: "2025-01-15",
  author: "ihid",
  featured: false,
  listed: true
};

const validFrontmatter = {
  title: "Test Post",
  excerpt: "This is a test post",
  tags: ["test", "example"],
  seo: {
    description: "Test post description",
    keywords: ["test", "post"]
  }
};

describe("validateBlogConfig", () => {
  it("should accept valid config", () => {
    expect(() => {
      validateBlogConfig("test-post", validBlogConfig, validAuthors, IMAGES_DIR);
    }).not.toThrow();
  });

  it("should reject config without date", () => {
    const { date: _date, ...invalid } = validBlogConfig;
    expect(() => {
      validateBlogConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(ValidationError);
  });

  it("should reject invalid date format", () => {
    const invalid = { ...validBlogConfig, date: "01-15-2025" };
    expect(() => {
      validateBlogConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/invalid date format/);
  });

  it("should reject non-existent author", () => {
    const invalid = { ...validBlogConfig, author: "nonexistent" };
    expect(() => {
      validateBlogConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/unknown author/);
  });

  it("should reject non-boolean featured field", () => {
    const invalid = { ...validBlogConfig, featured: "yes" };
    expect(() => {
      validateBlogConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/featured.*must be boolean/);
  });

  it("should reject non-existent cover image", () => {
    const invalid = { ...validBlogConfig, coverImage: "/images/blog/nonexistent.jpg" };
    expect(() => {
      validateBlogConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/missing cover image/);
  });
});

describe("validateArticleConfig", () => {
  it("should accept valid config", () => {
    expect(() => {
      validateArticleConfig("test-article", validArticleConfig, validAuthors);
    }).not.toThrow();
  });

  it("should reject config without date", () => {
    const { date: _date, ...invalid } = validArticleConfig;
    expect(() => {
      validateArticleConfig("test-article", invalid, validAuthors);
    }).toThrow(ValidationError);
  });

  it("should reject config without listed field", () => {
    const { listed: _listed, ...invalid } = validArticleConfig;
    expect(() => {
      validateArticleConfig("test-article", invalid, validAuthors);
    }).toThrow(/missing required field.*listed/);
  });

  it("should reject non-boolean listed field", () => {
    const invalid = { ...validArticleConfig, listed: "yes" };
    expect(() => {
      validateArticleConfig("test-article", invalid, validAuthors);
    }).toThrow(/listed.*must be boolean/);
  });

  it("should accept listed: false", () => {
    const config = { ...validArticleConfig, listed: false };
    expect(() => {
      validateArticleConfig("test-article", config, validAuthors);
    }).not.toThrow();
  });
});

describe("validateFrontmatter", () => {
  it("should accept valid frontmatter", () => {
    expect(() => {
      validateFrontmatter("test-post", "en", validFrontmatter);
    }).not.toThrow();
  });

  it("should reject frontmatter without title", () => {
    const { title: _title, ...invalid } = validFrontmatter;
    expect(() => {
      validateFrontmatter("test-post", "en", invalid);
    }).toThrow(ValidationError);
  });

  it("should reject frontmatter without excerpt", () => {
    const { excerpt: _excerpt, ...invalid } = validFrontmatter;
    expect(() => {
      validateFrontmatter("test-post", "en", invalid);
    }).toThrow(ValidationError);
  });

  it("should reject empty tags array", () => {
    const invalid = { ...validFrontmatter, tags: [] };
    expect(() => {
      validateFrontmatter("test-post", "en", invalid);
    }).toThrow(/tags.*cannot be empty/);
  });

  it("should reject missing SEO fields", () => {
    const invalid = { ...validFrontmatter, seo: { description: "Test" } };
    expect(() => {
      validateFrontmatter("test-post", "en", invalid);
    }).toThrow();
  });
});

describe("validateAuthors", () => {
  it("should accept valid authors", () => {
    expect(() => {
      validateAuthors(validAuthors, IMAGES_DIR);
    }).not.toThrow();
  });

  it("should reject author without name", () => {
    const invalid: AuthorRegistry = {
      test: {
        name: "",
        avatar: "/images/avatars/ihid.jpg"
      }
    };
    expect(() => {
      validateAuthors(invalid, IMAGES_DIR);
    }).toThrow(/invalid name/);
  });

  it("should reject author with non-existent avatar", () => {
    const invalid: AuthorRegistry = {
      test: {
        name: "Test Author",
        avatar: "/images/avatars/nonexistent.jpg"
      }
    };
    expect(() => {
      validateAuthors(invalid, IMAGES_DIR);
    }).toThrow(/missing avatar/);
  });
});

describe("validateNoDuplicateSlugs", () => {
  it("should accept unique slugs", () => {
    expect(() => {
      validateNoDuplicateSlugs(["post-1", "post-2", "post-3"]);
    }).not.toThrow();
  });

  it("should reject duplicate slugs", () => {
    expect(() => {
      validateNoDuplicateSlugs(["post-1", "post-2", "post-1"]);
    }).toThrow(/duplicate slugs/i);
  });
});

describe("validateTestimonials", () => {
  const structure = {
    people: {
      fred: { name: "Fred", image: "fred.webp" },
      artigiani: { name: "@m_artigiani", image: "m_artigiani.webp" },
      oleksandra: { name: "Oleksandra", image: "oleksandra.webp" }
    },
    quotes: {
      fred: { person: "fred" },
      "fred-short": { person: "fred" },
      artigiani: { person: "artigiani" },
      oleksandra: { person: "oleksandra" }
    },
    landing: { primary: "oleksandra", quotes: ["fred-short", "artigiani"] },
    page: ["fred", "artigiani"]
  };

  const copy = {
    heading: "What do our students think?",
    subheading: "Some extracts. <link>Read the full versions here!</link>",
    // artigiani intentionally has no role: a role is optional, and a person
    // without one must not be forced to invent one in every language.
    roles: { fred: "Total Beginner", oleksandra: "Coding Newbie" },
    quotes: {
      fred: "Great **course**, at length",
      "fred-short": "Great **course**",
      artigiani: "A game-changer",
      oleksandra: "A great quote"
    },
    marquee: ['"Amazing value"', '"Incredibly Fun!"']
  };

  it("should accept a valid structure and copy", () => {
    expect(() => validateTestimonials(structure, copy)).not.toThrow();
  });

  it("should reject a non-object", () => {
    expect(() => validateTestimonials([], copy)).toThrow(ValidationError);
    expect(() => validateTestimonials(structure, [])).toThrow(ValidationError);
  });

  it("should reject a missing heading", () => {
    const { heading: _heading, ...invalid } = copy;
    expect(() => validateTestimonials(structure, invalid)).toThrow(/heading/);
  });

  it("should reject a subheading without a <link> span", () => {
    expect(() => validateTestimonials(structure, { ...copy, subheading: "No link here" })).toThrow(/<link>/);
  });

  it("should reject a quote whose person does not exist", () => {
    const invalid = { ...structure, quotes: { ...structure.quotes, ghost: { person: "nobody" } } };
    expect(() => validateTestimonials(invalid, copy)).toThrow(/unknown person/);
  });

  it("should reject a quote with no English text", () => {
    const { fred: _fred, ...quotes } = copy.quotes;
    expect(() => validateTestimonials(structure, { ...copy, quotes })).toThrow(/no English text/);
  });

  it("should reject copy for a quote the structure does not define", () => {
    const quotes = { ...copy.quotes, stranger: "Who?" };
    expect(() => validateTestimonials(structure, { ...copy, quotes })).toThrow(/structure.json does not define/);
  });

  it("should reject a role for an unknown person", () => {
    const roles = { ...copy.roles, nobody: "Beginner" };
    expect(() => validateTestimonials(structure, { ...copy, roles })).toThrow(/unknown person/);
  });

  it("should reject an ordered list naming an unknown quote", () => {
    const invalid = { ...structure, page: ["fred", "missing"] };
    expect(() => validateTestimonials(invalid, copy)).toThrow(/unknown quote/);
  });

  it("should reject a primary that names an unknown quote", () => {
    const invalid = { ...structure, landing: { ...structure.landing, primary: "missing" } };
    expect(() => validateTestimonials(invalid, copy)).toThrow(/unknown quote/);
  });

  it("should reject the same quote listed twice on one page", () => {
    const invalid = { ...structure, page: ["fred", "fred"] };
    expect(() => validateTestimonials(invalid, copy)).toThrow(/twice/);
  });

  it("should reject an empty marquee", () => {
    expect(() => validateTestimonials(structure, { ...copy, marquee: [] })).toThrow(/marquee/);
  });
});

describe("validateEnglishSource", () => {
  it("should accept a slug dir with an English source", () => {
    expect(() => validateEnglishSource("blog", "my-post", "/posts/my-post", ["en"])).not.toThrow();
  });

  it("should reject a slug dir with no English source", () => {
    expect(() => validateEnglishSource("blog", "my-post", "/posts/my-post", [])).toThrow(/source\.md/);
  });

  it("should not require any other locale", () => {
    // Translations live in the i18n repo, so English alone is complete here.
    expect(() => validateEnglishSource("guide", "my-guide", "/posts/my-guide", ["en"])).not.toThrow();
  });
});

describe("validateProjectConfigIsStructural", () => {
  const validConfig = {
    image: "cover.webp",
    livestream: true,
    upcoming_streams: [],
    episodes: []
  };

  it("should accept a config holding structure only", () => {
    expect(() => validateProjectConfigIsStructural("my-project", validConfig)).not.toThrow();
  });

  it("should reject copy left behind in config.json", () => {
    const invalid = { ...validConfig, title: { en: "A project" } };
    expect(() => validateProjectConfigIsStructural("my-project", invalid)).toThrow(/messages\.json/);
  });

  it("should reject a config that is not an object", () => {
    expect(() => validateProjectConfigIsStructural("my-project", [])).toThrow(/not an object/);
  });
});

describe("validateProjectCopyCatalog", () => {
  const slugs = ["my-project"];
  const validCatalog = {
    "my-project": {
      title: "A project",
      description: "About the project",
      tags: ["web"]
    }
  };

  it("should accept a well-formed catalog", () => {
    expect(() => validateProjectCopyCatalog(validCatalog, slugs)).not.toThrow();
  });

  it("should reject a project with no entry", () => {
    expect(() => validateProjectCopyCatalog({}, slugs)).toThrow(/missing an entry/);
  });

  it("should reject an empty title", () => {
    const invalid = { "my-project": { ...validCatalog["my-project"], title: "  " } };
    expect(() => validateProjectCopyCatalog(invalid, slugs)).toThrow(/'title'/);
  });

  it("should reject tags that are not an array of strings", () => {
    const invalid = { "my-project": { ...validCatalog["my-project"], tags: { "0": "web" } } };
    expect(() => validateProjectCopyCatalog(invalid, slugs)).toThrow(/'tags'/);
  });

  it("should reject an entry for a project that does not exist", () => {
    const invalid = { ...validCatalog, "ghost-project": validCatalog["my-project"] };
    expect(() => validateProjectCopyCatalog(invalid, slugs)).toThrow(/unknown projects/);
  });
});

describe("validateEpisodeSummary", () => {
  const validSummary = { from: "Nothing", to: "A homepage", keyConcepts: ["html"] };

  it("should accept an absent summary", () => {
    expect(() => validateEpisodeSummary("episode-1", undefined)).not.toThrow();
  });

  it("should accept a well-formed summary", () => {
    expect(() => validateEpisodeSummary("episode-1", validSummary)).not.toThrow();
  });

  it("should reject a summary with an empty from", () => {
    expect(() => validateEpisodeSummary("episode-1", { ...validSummary, from: "  " })).toThrow(/summary\.from/);
  });

  it("should reject a summary with no keyConcepts", () => {
    expect(() => validateEpisodeSummary("episode-1", { ...validSummary, keyConcepts: [] })).toThrow(
      /summary\.keyConcepts/
    );
  });
});
