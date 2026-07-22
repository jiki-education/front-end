import {
  validateBlogConfig,
  validateArticleConfig,
  validateFrontmatter,
  validateAuthors,
  validateNoDuplicateSlugs,
  validateTestimonials,
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
  const validTestimonials = {
    heading: "What do our students think?",
    subheading: "Some extracts. <link>Read the full versions here!</link>",
    primary: { quote: "A great quote", name: "Oleksandra", role: "Coding Newbie", image: "oleksandra.webp" },
    quotes: [
      { slug: "fred", name: "Fred", role: "Total Beginner", image: "fred.webp", html: "Great <strong>course</strong>" },
      { slug: "artigiani", name: "@m_artigiani", role: "", image: "m_artigiani.webp", html: "A game-changer" }
    ],
    marquee: ['"Amazing value"', '"Incredibly Fun!"']
  };

  it("should accept valid testimonials", () => {
    expect(() => validateTestimonials("en", validTestimonials)).not.toThrow();
  });

  it("should accept a quote with an empty role", () => {
    // artigiani intentionally has no role — an empty string must be allowed.
    expect(() => validateTestimonials("en", validTestimonials)).not.toThrow();
  });

  it("should reject a non-object", () => {
    expect(() => validateTestimonials("en", [])).toThrow(ValidationError);
  });

  it("should reject a missing heading", () => {
    const { heading: _heading, ...invalid } = validTestimonials;
    expect(() => validateTestimonials("en", invalid)).toThrow(/heading/);
  });

  it("should reject a subheading without a <link> span", () => {
    const invalid = { ...validTestimonials, subheading: "No link here" };
    expect(() => validateTestimonials("en", invalid)).toThrow(/<link>/);
  });

  it("should reject a quote missing html", () => {
    const invalid = {
      ...validTestimonials,
      quotes: [{ slug: "fred", name: "Fred", role: "Beginner", image: "fred.webp" }]
    };
    expect(() => validateTestimonials("en", invalid)).toThrow(/html/);
  });

  it("should reject duplicate quote slugs", () => {
    const invalid = {
      ...validTestimonials,
      quotes: [validTestimonials.quotes[0], { ...validTestimonials.quotes[0] }]
    };
    expect(() => validateTestimonials("en", invalid)).toThrow(/duplicate/);
  });

  it("should reject an empty marquee", () => {
    const invalid = { ...validTestimonials, marquee: [] };
    expect(() => validateTestimonials("en", invalid)).toThrow(/marquee/);
  });
});
