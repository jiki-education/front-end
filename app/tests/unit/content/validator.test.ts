import {
  validateConfig,
  validateFrontmatter,
  validateAuthors,
  validateNoDuplicateSlugs,
  ValidationError
} from "@/lib/content/validator";
import type { AuthorRegistry } from "@/lib/content/types";
import path from "path";

const IMAGES_DIR = path.join(__dirname, "..", "..", "..", "..", "content", "images");

const validAuthors: AuthorRegistry = {
  ihid: {
    name: "Jeremy Walker",
    avatar: "/images/avatars/ihid.jpg"
  }
};

const validConfig = {
  date: "2025-01-15",
  author: "ihid",
  featured: false,
  coverImage: "/images/blog/hello-world.jpg"
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

describe("validateConfig", () => {
  it("should accept valid config", () => {
    expect(() => {
      validateConfig("test-post", validConfig, validAuthors, IMAGES_DIR);
    }).not.toThrow();
  });

  it("should reject config without date", () => {
    const { date: _date, ...invalid } = validConfig;
    expect(() => {
      validateConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(ValidationError);
  });

  it("should reject invalid date format", () => {
    const invalid = { ...validConfig, date: "01-15-2025" };
    expect(() => {
      validateConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/invalid date format/);
  });

  it("should reject non-existent author", () => {
    const invalid = { ...validConfig, author: "nonexistent" };
    expect(() => {
      validateConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/unknown author/);
  });

  it("should reject non-boolean featured field", () => {
    const invalid = { ...validConfig, featured: "yes" };
    expect(() => {
      validateConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/featured.*must be boolean/);
  });

  it("should reject non-existent cover image", () => {
    const invalid = { ...validConfig, coverImage: "/images/blog/nonexistent.jpg" };
    expect(() => {
      validateConfig("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/missing cover image/);
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
