#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Content Cache Generation Script
 *
 * Processes markdown files from the content package and produces:
 *
 *   public/static/content/{type}/{locale}/index-{hash}.json   (type: blog|articles|guides)
 *     - Metadata index: all entries with slug, title, date, etc.
 *
 *   public/static/content/{type}/{slug}/{locale}/content-{hash}.html
 *     - Content files: pre-rendered HTML from markdown
 *
 *   public/static/content/projects/{slug}/{locale}/index-{hash}.json
 *     - Per-project episode index
 *
 *   public/static/content/projects/{slug}/{uuid}/{locale}/content-{hash}.html
 *     - Episode content files: pre-rendered HTML from markdown
 *
 *   public/static/content/search/{type}/{locale}/index-{hash}.json
 *     - Lunr search indexes for articles + guides
 *
 *   lib/generated/content-hashes.ts
 *     - Hash manifest for the search indexes (type -> locale -> hash). Blog/
 *       article/guide metadata ships in content-meta-server.json instead.
 *
 *   lib/generated/content-meta-server.json
 *     - Full metadata for server-side rendering (SEO, list pages)
 *
 * Used by:
 * - Server-side content functions (lib/content/)
 * - Client-side search (lib/api/content-search.ts)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";
import markedFootnote from "marked-footnote";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import cssLanguage from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import lunr from "lunr";
import { computeHash, writeFile } from "./lib/cache-utils.js";

hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", cssLanguage);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("json", json);

marked.use(markedFootnote());
marked.use({
  renderer: {
    code({ text, lang }) {
      const language = (lang || "").split(/\s+/)[0].toLowerCase();
      if (!language || !hljs.getLanguage(language)) return false;
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>\n`;
    }
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../../content/src/posts");
const AUTHORS_FILE = path.join(__dirname, "../../content/src/authors.json");
const TESTIMONIALS_DIR = path.join(__dirname, "../../content/src/testimonials");
const IMAGES_SRC_DIR = path.join(__dirname, "../../content/images");
const STATIC_DIR = path.join(__dirname, "../public/static/content");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

// Content temporarily pulled from the site without deleting its files. See
// editors-blog-post.md (repo root) for why and how to bring it back.
const DISABLED_SLUGS = {
  blog: ["the-history-of-the-text-editor"]
};

// Load authors
let authorsData;
try {
  authorsData = JSON.parse(fs.readFileSync(AUTHORS_FILE, "utf-8"));
} catch (error) {
  console.error(`Failed to read authors file: ${AUTHORS_FILE}`);
  throw error;
}

const authorsJson = JSON.stringify(authorsData);

/**
 * Content-hash an image referenced as "/images/..." and copy it to the
 * immutable content cache, returning its fingerprinted public URL
 * (e.g. "/static/content/images/blog/foo.a1b2c3d4e5f6.webp").
 *
 * Source images live in the content package (content/images); the copies land
 * under /static/content/* which is served with an immutable cache lifetime, so
 * changing an image produces a new URL and busts the cache automatically.
 * Results are memoised so a shared asset (e.g. an author avatar) is hashed once.
 */
const imageUrlCache = new Map();
function hashAndCopyImage(imageRef) {
  if (!imageRef || !imageRef.startsWith("/images/")) {
    return imageRef;
  }
  if (imageUrlCache.has(imageRef)) {
    return imageUrlCache.get(imageRef);
  }

  const relPath = imageRef.slice("/images/".length);
  const srcPath = path.join(IMAGES_SRC_DIR, relPath);
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Referenced image not found: ${imageRef} (looked in ${srcPath})`);
  }

  const bytes = fs.readFileSync(srcPath);
  const hash = computeHash(bytes);
  const ext = path.extname(relPath);
  const outRel = `${relPath.slice(0, -ext.length)}-${hash}${ext}`;
  writeFile(path.join(STATIC_DIR, "images", outRel), bytes);

  const url = `/static/content/images/${outRel}`;
  imageUrlCache.set(imageRef, url);
  return url;
}

/**
 * Rewrite image paths ("/images/...") to their fingerprinted URLs. Handles both
 * markdown images (![alt](/images/...)) and raw <img src="/images/..."> tags,
 * the latter so posts can use <figure>/<figcaption> HTML for captioned images.
 */
function fixImagePaths(content) {
  let out = content.replace(
    /!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g,
    (_match, alt, imagePath) => `![${alt}](${hashAndCopyImage(imagePath)})`
  );
  out = out.replace(
    /(<img\b[^>]*\bsrc=")(\/images\/[^"]+)(")/g,
    (_match, pre, imagePath, post) => `${pre}${hashAndCopyImage(imagePath)}${post}`
  );
  return out;
}

/**
 * Fingerprint a coverImage/avatar path ("/images/...") for immutable caching.
 */
function fixCoverImagePath(coverImage) {
  return hashAndCopyImage(coverImage);
}

/**
 * Rewrite an author's avatar /images/ path to /static/images/ for public serving
 */
function fixAuthorAvatar(author) {
  return { ...author, avatar: fixCoverImagePath(author.avatar) };
}

/**
 * Estimate reading time from markdown content
 */
function estimateReadingTime(markdownContent) {
  const wordsPerMinute = 200;
  const words = markdownContent.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Process a content directory (blog or articles) and return processed data
 *
 * Returns: { [slug]: { [locale]: { meta, html } } }
 */
function processContentDir(type, requiredFields, extraFields) {
  const contentDir = path.join(CONTENT_DIR, type);
  const result = {};

  if (!fs.existsSync(contentDir)) {
    return result;
  }

  const disabledSlugs = DISABLED_SLUGS[type] ?? [];
  const slugDirs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !disabledSlugs.includes(d.name));

  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const slugPath = path.join(contentDir, slug);
    const configPath = path.join(slugPath, "config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(`Missing config.json for ${type}/${slug}`);
    }

    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${configPath}: ${error.message}`);
    }

    const configJson = JSON.stringify(config);

    for (const field of requiredFields) {
      if (config[field] === undefined) {
        throw new Error(`Missing required field "${field}" in ${configPath}`);
      }
    }

    const mdFiles = fs
      .readdirSync(slugPath, { withFileTypes: true })
      .filter((f) => f.isFile() && f.name.endsWith(".md"));

    result[slug] = {};

    for (const file of mdFiles) {
      const locale = path.basename(file.name, ".md");
      const filePath = path.join(slugPath, file.name);

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = matter(fileContent);
        const frontmatter = parsed.data;
        const fixedMarkdown = fixImagePaths(parsed.content);

        // Author is optional: guides have no author, whereas blog posts and
        // articles do. Only look it up (and include it in the meta) when set.
        let author;
        if (config.author !== undefined) {
          const rawAuthor = authorsData[config.author];
          if (!rawAuthor) {
            throw new Error(`Author not found: ${config.author} in ${filePath}`);
          }
          author = fixAuthorAvatar(rawAuthor);
        }

        // Pre-render markdown to HTML
        const html = marked.parse(fixedMarkdown);

        // Hash based on all inputs that affect the output
        const hashInput = crypto.createHash("sha256");
        hashInput.update(fileContent);
        hashInput.update(configJson);
        hashInput.update(authorsJson);
        const contentHash = hashInput.digest("hex").slice(0, 12);

        const readingTime = estimateReadingTime(fixedMarkdown);

        const meta = {
          slug,
          title: frontmatter.title,
          date: config.date,
          excerpt: frontmatter.excerpt,
          ...(author ? { author } : {}),
          tags: frontmatter.tags || [],
          seo: frontmatter.seo || { description: frontmatter.excerpt, keywords: [] },
          readingTime,
          contentHash,
          locale,
          ...extraFields(config)
        };

        result[slug][locale] = { meta, html };
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        throw error;
      }
    }
  }

  return result;
}

/**
 * Process the projects/ directory.
 *
 * Structure:
 *   projects/
 *     config.json                 — { projects: ["slug1", "slug2", ...] } (ordered)
 *     {project-slug}/
 *       config.json               — project details + episodes: [uuid, ...] (ordered)
 *       {uuid}/
 *         config.json             — episode metadata (no project, no order)
 *         {locale}.md             — episode content per locale (body is the transcript)
 *
 * A project with an empty episodes array is "coming soon".
 *
 * Returns: { projectsData, episodes: [{ uuid, projectSlug, order, config, locales }] }
 *   where projectsData.projects is an ordered array of { slug, ...details }
 */
function processProjects() {
  const projectsDir = path.join(CONTENT_DIR, "projects");
  if (!fs.existsSync(projectsDir)) {
    return null;
  }

  const topConfigPath = path.join(projectsDir, "config.json");
  if (!fs.existsSync(topConfigPath)) {
    throw new Error(`Missing projects/config.json at ${topConfigPath}`);
  }

  let topConfig;
  try {
    topConfig = JSON.parse(fs.readFileSync(topConfigPath, "utf-8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${topConfigPath}: ${error.message}`);
  }

  if (!Array.isArray(topConfig.projects)) {
    throw new Error(`projects/config.json must have a "projects" array of slugs`);
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const requiredEpisodeFields = ["slug", "date", "author", "videoProvider", "videoKey", "durationSeconds", "image"];

  const projectsList = [];
  const episodes = [];
  const seenUuids = new Set();
  const seenProjectSlugs = new Set();

  for (const projectSlug of topConfig.projects) {
    if (typeof projectSlug !== "string" || !projectSlug) {
      throw new Error(`projects/config.json "projects" entries must be non-empty slug strings`);
    }
    if (seenProjectSlugs.has(projectSlug)) {
      throw new Error(`Duplicate project slug in projects/config.json: "${projectSlug}"`);
    }
    seenProjectSlugs.add(projectSlug);

    const projectDir = path.join(projectsDir, projectSlug);
    if (!fs.existsSync(projectDir) || !fs.statSync(projectDir).isDirectory()) {
      throw new Error(`Project "${projectSlug}" listed in projects/config.json has no directory at ${projectDir}`);
    }

    const projectConfigPath = path.join(projectDir, "config.json");
    if (!fs.existsSync(projectConfigPath)) {
      throw new Error(`Missing config.json for project "${projectSlug}" at ${projectConfigPath}`);
    }

    let projectConfig;
    try {
      projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${projectConfigPath}: ${error.message}`);
    }

    if (!Array.isArray(projectConfig.episodes)) {
      throw new Error(`Project "${projectSlug}" config.json must have an "episodes" array of UUIDs`);
    }
    if (typeof projectConfig.image !== "string" || !projectConfig.image) {
      throw new Error(`Project "${projectSlug}" is missing required "image" field`);
    }

    projectsList.push({ slug: projectSlug, ...projectConfig });

    const slugsInProject = new Set();
    for (let i = 0; i < projectConfig.episodes.length; i++) {
      const uuid = projectConfig.episodes[i];
      if (typeof uuid !== "string" || !uuidPattern.test(uuid)) {
        throw new Error(`Project "${projectSlug}" episodes[${i}] is not a valid UUID: ${uuid}`);
      }
      const uuidLower = uuid.toLowerCase();
      if (seenUuids.has(uuidLower)) {
        throw new Error(`Duplicate episode UUID across projects: ${uuid}`);
      }
      seenUuids.add(uuidLower);

      const dirPath = path.join(projectDir, uuid);
      if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        throw new Error(`Project "${projectSlug}" references missing episode directory: ${dirPath}`);
      }

      const configPath = path.join(dirPath, "config.json");
      if (!fs.existsSync(configPath)) {
        throw new Error(`Missing config.json for episode ${uuid}`);
      }

      let config;
      try {
        config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      } catch (error) {
        throw new Error(`Invalid JSON in ${configPath}: ${error.message}`);
      }

      for (const field of requiredEpisodeFields) {
        if (config[field] === undefined) {
          throw new Error(`Missing required field "${field}" in ${configPath}`);
        }
      }

      if (config.guides !== undefined) {
        if (!Array.isArray(config.guides) || config.guides.some((g) => typeof g !== "string" || !g)) {
          throw new Error(`Episode "${config.slug}" "guides" must be an array of guide slug strings`);
        }
      }

      if (slugsInProject.has(config.slug)) {
        throw new Error(`Duplicate episode slug "${config.slug}" in project "${projectSlug}"`);
      }
      slugsInProject.add(config.slug);

      const order = i + 1;
      const configJson = JSON.stringify({ ...config, project: projectSlug, order });

      const rawAuthor = authorsData[config.author];
      if (!rawAuthor) {
        throw new Error(`Author not found: ${config.author} in ${configPath}`);
      }
      const author = fixAuthorAvatar(rawAuthor);

      const mdFiles = fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith(".md"));

      const localesOut = {};

      for (const file of mdFiles) {
        const locale = path.basename(file.name, ".md");
        const filePath = path.join(dirPath, file.name);

        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const parsed = matter(fileContent);
          const frontmatter = parsed.data;
          const fixedMarkdown = fixImagePaths(parsed.content);
          const html = marked.parse(fixedMarkdown);

          const summary = normalizeEpisodeSummary(frontmatter.summary, `${filePath}`);

          const hashInput = crypto.createHash("sha256");
          hashInput.update(fileContent);
          hashInput.update(configJson);
          hashInput.update(authorsJson);
          const contentHash = hashInput.digest("hex").slice(0, 12);

          const meta = {
            uuid,
            slug: config.slug,
            project: projectSlug,
            order,
            title: frontmatter.title,
            excerpt: frontmatter.excerpt,
            date: config.date,
            author,
            videoProvider: config.videoProvider,
            videoKey: config.videoKey,
            durationSeconds: config.durationSeconds,
            premium: Boolean(config.premium),
            image: config.image,
            guides: config.guides || [],
            summary,
            seo: frontmatter.seo || { description: frontmatter.excerpt, keywords: [] },
            contentHash,
            locale
          };

          localesOut[locale] = { meta, html };
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error.message);
          throw error;
        }
      }

      episodes.push({ uuid, projectSlug, order, config, locales: localesOut });
    }
  }

  return { projectsData: { projects: projectsList }, episodes };
}

/**
 * Validate and normalize an episode's frontmatter `summary` block
 * ({ from, to, keyConcepts }). All fields are freeform localized prose.
 * Returns null when no summary is authored.
 */
function normalizeEpisodeSummary(summary, sourcePath) {
  if (summary === undefined || summary === null) {
    return null;
  }
  if (typeof summary !== "object" || Array.isArray(summary)) {
    throw new Error(`"summary" must be a mapping with from/to/keyConcepts in ${sourcePath}`);
  }
  const { from, to } = summary;
  if (typeof from !== "string" || !from || typeof to !== "string" || !to) {
    throw new Error(`"summary" requires non-empty "from" and "to" strings in ${sourcePath}`);
  }
  const keyConcepts = summary.keyConcepts ?? [];
  if (!Array.isArray(keyConcepts) || keyConcepts.some((c) => typeof c !== "string" || !c)) {
    throw new Error(`"summary.keyConcepts" must be an array of strings in ${sourcePath}`);
  }
  return { from, to, keyConcepts };
}

/**
 * Build static files for the projects/ section.
 *
 * Emits:
 *   - public/static/content/projects/{projectSlug}/{uuid}/{locale}-{htmlHash}.html
 *   - public/static/content/projects/{projectSlug}/episodes-{locale}-{indexHash}.json
 *
 * Returns: { projectsByLocale } where projectsByLocale[locale] = [projectEntry], each projectEntry
 *   contains slug, order, title, description, episodeCount, episodesIndexHash.
 */
function buildProjectStaticFiles(processed) {
  if (!processed) {
    return { projectsByLocale: {} };
  }

  const { projectsData, episodes } = processed;

  // episodesBy[locale][projectSlug] = [episodeMeta]
  const episodesBy = {};

  for (const episode of episodes) {
    for (const [locale, { meta, html }] of Object.entries(episode.locales)) {
      const htmlHash = computeHash(html);
      const htmlPath = path.join(
        STATIC_DIR,
        "projects",
        meta.project,
        episode.uuid,
        locale,
        `content-${htmlHash}.html`
      );
      writeFile(htmlPath, html);

      const finalMeta = { ...meta, contentHash: htmlHash };

      if (!episodesBy[locale]) {
        episodesBy[locale] = {};
      }
      if (!episodesBy[locale][meta.project]) {
        episodesBy[locale][meta.project] = [];
      }
      episodesBy[locale][meta.project].push(finalMeta);
    }
  }

  const projectsByLocale = {};

  // Determine all locales that have any project content. Project titles only use
  // locales declared in config title maps; episodes contribute locales too.
  const allLocales = new Set();
  for (const p of projectsData.projects) {
    for (const loc of Object.keys(p.title || {})) {
      allLocales.add(loc);
    }
  }
  for (const loc of Object.keys(episodesBy)) {
    allLocales.add(loc);
  }

  for (const locale of allLocales) {
    projectsByLocale[locale] = [];

    let order = 0;
    for (const project of projectsData.projects) {
      order += 1;
      const title = (project.title && (project.title[locale] || project.title.en)) || project.slug;
      const description = (project.description && (project.description[locale] || project.description.en)) || "";
      const tags = (project.tags && (project.tags[locale] || project.tags.en)) || [];
      const upcomingStreams = Array.isArray(project.upcoming_streams) ? project.upcoming_streams : [];
      if (typeof project.image !== "string" || !project.image) {
        throw new Error(`Project "${project.slug}" is missing required "image" field`);
      }
      const image = project.image;
      if (typeof project.livestream !== "boolean") {
        throw new Error(`Project "${project.slug}" is missing required boolean "livestream" field`);
      }
      const livestream = project.livestream;

      const projectEpisodes = (episodesBy[locale] && episodesBy[locale][project.slug]) || [];
      const sortedEpisodes = [...projectEpisodes].sort((a, b) => a.order - b.order);

      const indexJson = JSON.stringify(sortedEpisodes);
      const indexHash = computeHash(indexJson);
      const indexPath = path.join(STATIC_DIR, "projects", project.slug, locale, `index-${indexHash}.json`);
      writeFile(indexPath, indexJson);

      projectsByLocale[locale].push({
        slug: project.slug,
        order,
        title,
        description,
        tags,
        image,
        livestream,
        upcomingStreams,
        episodeCount: sortedEpisodes.length,
        episodesIndexHash: indexHash,
        locale
      });
    }
  }

  return { projectsByLocale };
}

/**
 * Build static files for a content type (blog or articles).
 * Returns { indexHashes, byLocale } where byLocale maps locale -> [meta entries]
 */
function buildStaticFiles(type, content) {
  const byLocale = {};

  for (const [slug, locales] of Object.entries(content)) {
    for (const [locale, { meta, html }] of Object.entries(locales)) {
      if (!byLocale[locale]) {
        byLocale[locale] = [];
      }

      // Write pre-rendered HTML content file
      const htmlHash = computeHash(html);
      const contentPath = path.join(STATIC_DIR, type, slug, locale, `content-${htmlHash}.html`);
      writeFile(contentPath, html);

      // Use the HTML hash as contentHash (for URL construction). Per-entry
      // metadata is served from the bundled content-meta-server.json, so no
      // separate per-locale index file is emitted for blog/articles/guides.
      byLocale[locale].push({ ...meta, contentHash: htmlHash });
    }
  }

  return { byLocale };
}

/**
 * Generate Lunr search indexes for a content type (one per locale).
 *
 * `type` is the filename prefix (e.g. "articles", "guides"). `filterFn` selects
 * which entries to index (articles index only `listed` ones; guides index all,
 * including premium ones so premium guides remain searchable). The JSON shape is
 * shared across types: { index, items }.
 *
 * Returns search index hashes per locale.
 */
function generateSearchIndexes(type, byLocale, filterFn) {
  const searchHashes = {};

  for (const [locale, entries] of Object.entries(byLocale)) {
    const items = entries.filter(filterFn);

    const idx = lunr(function () {
      this.ref("slug");
      this.field("title", { boost: 10 });
      this.field("excerpt", { boost: 5 });
      this.field("description", { boost: 4 });
      this.field("keywords", { boost: 3 });

      for (const item of items) {
        this.add({
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          description: item.seo.description,
          keywords: item.seo.keywords.join(" ")
        });
      }
    });

    const metadata = items.map((item) => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt
    }));

    const output = JSON.stringify({ index: idx.toJSON(), items: metadata });
    const searchHash = computeHash(output);
    searchHashes[locale] = searchHash;

    const searchPath = path.join(STATIC_DIR, "search", type, locale, `index-${searchHash}.json`);
    writeFile(searchPath, output);
    console.log(`   Search index: search/${type}/${locale}/index-${searchHash}.json (${items.length} ${type})`);
  }

  return searchHashes;
}

/**
 * Write the TypeScript hash manifest.
 *
 * Only the search-index hashes are emitted: blog/articles/guides metadata is
 * served from the bundled content-meta-server.json (so no per-locale index files
 * are generated), and per-project episode indexes are fetched via the
 * `episodesIndexHash` carried in that same bundled metadata.
 */
function writeHashManifest(searchHashes, guideSearchHashes) {
  function formatEntries(hashes) {
    return Object.entries(hashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([locale, hash]) => `      ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
      .join(",\n");
  }

  const content = `// Auto-generated by scripts/generate-content-cache.js — DO NOT EDIT
export const contentIndexHashes: {
  search: { articles: Record<string, string>; guides: Record<string, string> };
} = {
  search: {
    articles: {
${formatEntries(searchHashes)},
    },
    guides: {
${formatEntries(guideSearchHashes)},
    },
  },
};
`;

  writeFile(path.join(GENERATED_DIR, "content-hashes.ts"), content);
}

/**
 * Write the server-side metadata JSON
 * Contains full metadata for all blog posts and articles (no HTML content)
 */
/**
 * Process landing-page testimonials.
 *
 * Structure:
 *   testimonials/
 *     {locale}.json   — full testimonials data (heading, primary, quotes, marquee)
 *
 * Testimonials are structured editorial data (not markdown), so they are baked
 * verbatim into content-meta-server.json for synchronous SSR delivery. Images
 * are referenced by filename only; the presentational avatar assets live with
 * the landing-page component.
 *
 * Returns: { [locale]: testimonialsData }
 */
function processTestimonials() {
  const result = {};
  if (!fs.existsSync(TESTIMONIALS_DIR)) {
    return result;
  }

  const files = fs
    .readdirSync(TESTIMONIALS_DIR, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith(".json"));

  for (const file of files) {
    const locale = path.basename(file.name, ".json");
    const filePath = path.join(TESTIMONIALS_DIR, file.name);
    try {
      result[locale] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
  }

  return result;
}

function writeServerMeta(blogByLocale, articlesByLocale, guidesByLocale, projectsByLocale, testimonialsByLocale) {
  const serverMeta = {
    blog: {},
    articles: {},
    guides: {},
    projects: {},
    testimonials: {},
    locales: {
      blog: Object.keys(blogByLocale).sort(),
      articles: Object.keys(articlesByLocale).sort(),
      guides: Object.keys(guidesByLocale).sort(),
      projects: Object.keys(projectsByLocale).sort()
    },
    slugsWithLocales: {
      blog: [],
      articles: [],
      guides: []
    }
  };

  for (const [locale, posts] of Object.entries(blogByLocale)) {
    serverMeta.blog[locale] = posts;
    for (const post of posts) {
      serverMeta.slugsWithLocales.blog.push({ slug: post.slug, locale });
    }
  }

  for (const [locale, articles] of Object.entries(articlesByLocale)) {
    serverMeta.articles[locale] = articles;
    for (const article of articles) {
      serverMeta.slugsWithLocales.articles.push({ slug: article.slug, locale });
    }
  }

  for (const [locale, guides] of Object.entries(guidesByLocale)) {
    serverMeta.guides[locale] = guides;
    for (const guide of guides) {
      serverMeta.slugsWithLocales.guides.push({ slug: guide.slug, locale });
    }
  }

  for (const [locale, projectsList] of Object.entries(projectsByLocale)) {
    serverMeta.projects[locale] = projectsList;
  }

  for (const [locale, testimonials] of Object.entries(testimonialsByLocale)) {
    serverMeta.testimonials[locale] = testimonials;
  }

  writeFile(path.join(GENERATED_DIR, "content-meta-server.json"), JSON.stringify(serverMeta));
}

/**
 * Main generation function
 */
function generateContentCache() {
  console.log("Generating content cache...\n");

  // Clean output directory
  if (fs.existsSync(STATIC_DIR)) {
    fs.rmSync(STATIC_DIR, { recursive: true });
  }
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // Process blog posts
  const blog = processContentDir("blog", ["date", "author", "featured", "coverImage"], (config) => ({
    featured: config.featured,
    coverImage: fixCoverImagePath(config.coverImage) || ""
  }));

  // Process articles
  const articles = processContentDir("articles", ["date", "author", "listed"], (config) => ({
    listed: config.listed
  }));

  // Process guides (cover image like blog posts, premium flag, order, no author)
  const guides = processContentDir("guides", ["date", "coverImage", "premium"], (config) => ({
    coverImage: fixCoverImagePath(config.coverImage) || "",
    premium: Boolean(config.premium),
    order: typeof config.order === "number" ? config.order : 1000
  }));

  // Process projects + episodes
  const projectsProcessed = processProjects();

  // Process landing-page testimonials (structured editorial data)
  const testimonialsByLocale = processTestimonials();

  // Build static files
  const { byLocale: blogByLocale } = buildStaticFiles("blog", blog);
  const { byLocale: articlesByLocale } = buildStaticFiles("articles", articles);
  const { byLocale: guidesByLocale } = buildStaticFiles("guides", guides);
  const { projectsByLocale } = buildProjectStaticFiles(projectsProcessed);

  // Generate search indexes. Articles index only `listed` ones; guides index all
  // (including premium guides, which stay searchable but are kept out of the sitemap).
  const searchHashes = generateSearchIndexes("articles", articlesByLocale, (a) => a.listed);
  const guideSearchHashes = generateSearchIndexes("guides", guidesByLocale, () => true);

  // Write hash manifest (search indexes only — see writeHashManifest)
  writeHashManifest(searchHashes, guideSearchHashes);

  // Write server-side metadata
  writeServerMeta(blogByLocale, articlesByLocale, guidesByLocale, projectsByLocale, testimonialsByLocale);

  // Count totals
  let contentFileCount = 0;
  for (const locales of Object.values(blog)) {
    contentFileCount += Object.keys(locales).length;
  }
  for (const locales of Object.values(articles)) {
    contentFileCount += Object.keys(locales).length;
  }
  for (const locales of Object.values(guides)) {
    contentFileCount += Object.keys(locales).length;
  }

  const episodeCount = projectsProcessed
    ? projectsProcessed.episodes.reduce((acc, ep) => acc + Object.keys(ep.locales).length, 0)
    : 0;
  const projectCount = projectsProcessed ? projectsProcessed.projectsData.projects.length : 0;

  console.log("\nContent cache generated successfully:\n");
  console.log(`   Blog posts: ${Object.keys(blog).length} slugs`);
  console.log(`   Articles: ${Object.keys(articles).length} slugs`);
  console.log(`   Guides: ${Object.keys(guides).length} slugs`);
  console.log(`   Projects: ${projectCount}`);
  console.log(`   Testimonials: ${Object.keys(testimonialsByLocale).length} locales`);
  console.log(`   Project episodes: ${episodeCount} (locale-files)`);
  console.log(`   Content files: ${contentFileCount}`);
  console.log(
    `   Locales: ${[
      ...new Set([
        ...Object.keys(blogByLocale),
        ...Object.keys(articlesByLocale),
        ...Object.keys(guidesByLocale),
        ...Object.keys(projectsByLocale)
      ])
    ]
      .sort()
      .join(", ")}`
  );
  console.log(`   Output: ${STATIC_DIR}\n`);
}

// Run generation
try {
  generateContentCache();
} catch (error) {
  console.error("Failed to generate content cache:", error);
  process.exit(1);
}
