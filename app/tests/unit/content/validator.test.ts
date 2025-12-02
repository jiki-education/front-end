import {
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

const validFrontmatter = {
  title: "Test Post",
  date: "2025-01-15",
  excerpt: "This is a test post",
  author: "ihid",
  tags: ["test", "example"],
  seo: {
    description: "Test post description",
    keywords: ["test", "post"]
  },
  featured: false,
  coverImage: "/images/blog/jiki-launch.jpg"
};

describe("validateFrontmatter", () => {
  it("should accept valid frontmatter", () => {
    expect(() => {
      validateFrontmatter("test-post", validFrontmatter, validAuthors, IMAGES_DIR);
    }).not.toThrow();
  });

  it("should reject frontmatter without title", () => {
    const { title: _title, ...invalid } = validFrontmatter;
    expect(() => {
      validateFrontmatter("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(ValidationError);
  });

  it("should reject invalid date format", () => {
    const invalid = { ...validFrontmatter, date: "01-15-2025" };
    expect(() => {
      validateFrontmatter("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/invalid date format/);
  });

  it("should reject non-existent author", () => {
    const invalid = { ...validFrontmatter, author: "nonexistent" };
    expect(() => {
      validateFrontmatter("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/unknown author/);
  });

  it("should reject empty tags array", () => {
    const invalid = { ...validFrontmatter, tags: [] };
    expect(() => {
      validateFrontmatter("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/tags.*cannot be empty/);
  });

  it("should reject non-boolean featured field", () => {
    const invalid = { ...validFrontmatter, featured: "yes" };
    expect(() => {
      validateFrontmatter("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/featured.*must be boolean/);
  });

  it("should reject missing SEO fields", () => {
    const invalid = { ...validFrontmatter, seo: { description: "Test" } };
    expect(() => {
      validateFrontmatter("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow();
  });

  it("should reject non-existent cover image", () => {
    const invalid = { ...validFrontmatter, coverImage: "/images/blog/nonexistent.jpg" };
    expect(() => {
      validateFrontmatter("test-post", invalid, validAuthors, IMAGES_DIR);
    }).toThrow(/missing cover image/);
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
