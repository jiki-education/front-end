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
 *   public/static/content/structure-{hash}.json
 *     - Locale-invariant post metadata: date, author, cover image, and the
 *       featured/listed/premium/order flags, all from English config
 *
 *   public/static/content/copy/{locale}/copy-{hash}.json
 *     - Translated post metadata: title, excerpt, seo, tags, reading time and
 *       that locale's content hash. Published by the i18n repo for every
 *       non-English locale; the app merges it with the structure above.
 *
 *   public/static/content/meta/{locale}/index-{hash}.json
 *     - Projects and testimonials, which are per-locale but are not Markdown and
 *       so stay front-end published
 *
 *   lib/generated/content-hashes.ts
 *     - Hash manifests for the search indexes, the per-locale metadata and the
 *       locale-invariant structure
 *
 * Used by:
 * - Server-side content functions (lib/content/)
 * - Client-side search (lib/api/content-search.ts)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { computeHash, writeFile } from "./lib/cache-utils.js";
import {
  buildSearchIndex,
  parseFrontmatter,
  postImageUrl,
  renderPost,
  rewriteImageRefs
} from "@jiki.io/content-renderer";

// Markdown to HTML (the marked config, the marked-footnote plugin, the stock
// highlight.js grammar set, the /images/ rewrite, and the <define>/<literal>
// strip) lives in @jiki.io/content-renderer rather than here, because the i18n
// repo publishes translated posts to the same content-hashed R2 tree and its
// bytes must match these exactly. See that package's src/posts.ts for why posts
// are a second renderer beside the concept one rather than a flag on it.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../../content/src/posts");
const AUTHORS_FILE = path.join(__dirname, "../../content/src/authors.json");
const TESTIMONIALS_DIR = path.join(__dirname, "../../content/src/testimonials");
const IMAGES_SRC_DIR = path.join(__dirname, "../../content/images");
const STATIC_DIR = path.join(__dirname, "../public/static/content");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

// Content temporarily pulled from the site without deleting its files. See
// editors-blog-post.md (repo root) for why and how to bring it back.
// English. Its hashes are compiled into the worker and its artifacts ship with
// the deploy, so it has no pointer and never needs one.
const DEFAULT_LOCALE = "en";

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
  // The URL shape comes from the renderer package because it lands INSIDE the
  // rendered HTML, whose hash is its filename. Two publishers that fingerprint
  // an image differently produce different pages for identical Markdown.
  const url = postImageUrl(relPath, computeHash(bytes));
  writeFile(path.join(STATIC_DIR, "images", url.slice("/static/content/images/".length)), bytes);

  imageUrlCache.set(imageRef, url);
  return url;
}

/**
 * Rewrite image paths ("/images/...") to their fingerprinted URLs. Handles both
 * markdown images (![alt](/images/...)) and raw <img src="/images/..."> tags,
 * the latter so posts can use <figure>/<figcaption> HTML for captioned images.
 */
function fixImagePaths(content) {
  return rewriteImageRefs(content, hashAndCopyImage);
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
      // English is authored in source.md (the source of truth); map that file to
      // the "en" locale. Every other file is named <locale>.md (e.g. hu.md).
      const baseName = path.basename(file.name, ".md");
      const locale = baseName === "source" ? "en" : baseName;
      const filePath = path.join(slugPath, file.name);

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = parseFrontmatter(fileContent);
        const frontmatter = parsed.data;
        const fixedMarkdown = fixImagePaths(parsed.body);

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

        // Pre-render markdown to HTML. renderPost applies the same image rewrite
        // itself (it is inside the byte contract), which is a no-op the second
        // time because a rewritten ref no longer starts with "/images/".
        const html = renderPost(parsed.body, { resolveImage: hashAndCopyImage });

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
        // English is authored in source.md (the source of truth); map that file
        // to the "en" locale. Every other file is named <locale>.md (e.g. hu.md).
        const baseName = path.basename(file.name, ".md");
        const locale = baseName === "source" ? "en" : baseName;
        const filePath = path.join(dirPath, file.name);

        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const parsed = parseFrontmatter(fileContent);
          const frontmatter = parsed.data;
          // renderPost applies the /images/ rewrite itself, and the resolver
          // copies each referenced image into the cache as it goes.
          const html = renderPost(parsed.body, { resolveImage: hashAndCopyImage });

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
      // metadata is split into the locale-invariant structure and the
      // translated copy by writeContentMeta below.
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

    // Built by @jiki.io/content-renderer, because a search index is derived
    // entirely from translated copy and so is published by the i18n repo for
    // every non-English locale. Field order, boosts and the lunr version are all
    // part of the bytes, so they live in the package both repos pin.
    const output = JSON.stringify(
      buildSearchIndex(
        items.map((item) => ({
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          description: item.seo.description,
          keywords: item.seo.keywords.join(" ")
        }))
      )
    );
    const searchHash = computeHash(output);
    searchHashes[locale] = searchHash;

    const searchPath = path.join(STATIC_DIR, "search", type, locale, `index-${searchHash}.json`);
    writeFile(searchPath, output);
    if (locale !== DEFAULT_LOCALE) {
      writeFile(
        path.join(STATIC_DIR, "search", type, locale, "current.json"),
        `${JSON.stringify({ hash: searchHash })}\n`
      );
    }
    console.log(`   Search index: search/${type}/${locale}/index-${searchHash}.json (${items.length} ${type})`);
  }

  return searchHashes;
}

/**
 * Write the TypeScript hash manifest.
 *
 * Three kinds of hash: the search indexes, the per-locale metadata (projects and
 * testimonials, plus the translated copy this repo writes for local dev), and
 * the one locale-invariant structure hash. Only the default locale is ever read
 * from the per-locale maps at runtime; the rest resolve through their pointers.
 * Per-project episode indexes are fetched via the `episodesIndexHash` carried in
 * the per-locale metadata.
 */
function writeHashManifest(searchHashes, guideSearchHashes, { copyHashes, localHashes, structureHash }) {
  function formatEntries(hashes) {
    return Object.entries(hashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([locale, hash]) => `      ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
      .join(",\n");
  }

  const content = `// Auto-generated by scripts/generate-content-cache.js — DO NOT EDIT
//
// Only the DEFAULT LOCALE's hashes are read at runtime. Every other locale
// resolves through its pointer (see lib/i18n/catalogPointer.ts), so a locale the
// i18n repo publishes after this build is still reachable. The non-default
// entries are kept because they are what a local build without R2 runs on.
export const contentIndexHashes: {
  search: { articles: Record<string, string>; guides: Record<string, string> };
  meta: Record<string, string>;
  copy: Record<string, string>;
} = {
  search: {
    articles: {
${formatEntries(searchHashes)},
    },
    guides: {
${formatEntries(guideSearchHashes)},
    },
  },
  meta: {
${formatEntries(localHashes)},
  },
  copy: {
${formatEntries(copyHashes)},
  },
};

// Locale-invariant: every post's date, author, cover image and flags come from
// English config, so one object serves every language and ships with the deploy.
export const contentStructureHash = ${JSON.stringify(structureHash)};
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
 * Testimonials are structured editorial data (not markdown), so they are not in
 * the corpus the i18n repo mirrors and stay front-end published, in the
 * per-locale metadata artifact. Images are referenced by filename only; the
 * presentational avatar assets live with the landing-page component.
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

/**
 * Write ONE metadata artifact per locale, plus its dev pointer.
 *
 * This used to be a single `content-meta-server.json` bundled into the worker
 * and imported synchronously. That made every listing page, every piece of SEO
 * metadata and the whole landing page depend on data fixed at BUILD time, so a
 * locale the i18n repo published afterwards could serve its post bodies from R2
 * and still be invisible in every listing. Per-locale, content-hashed and
 * fetched, it is on exactly the same footing as every other translated artifact.
 *
 * `hasContent` is what the listing routes 404 on. It is a per-locale fact, so it
 * lives in that locale's own artifact rather than in a cross-locale index that
 * two repos would both have to write.
 *
 * Returns { [locale]: hash }.
 */
function writeContentMeta(blogByLocale, articlesByLocale, guidesByLocale, projectsByLocale, testimonialsByLocale) {
  // Post metadata splits three ways, along what each part actually is.
  //
  //   1. STRUCTURE, locale-invariant. Date, author, cover image, featured,
  //      listed, premium, order. All of it comes from English config.json and
  //      authors.json, none of it varies by language, and the i18n repo does not
  //      hold any of it. One object serves every locale.
  //   2. COPY, per locale. Title, excerpt, seo, tags, reading time, and the hash
  //      of that locale's rendered HTML. Every one of those is produced by
  //      translating, so the i18n repo publishes them and a locale it adds needs
  //      no front-end build to appear in a listing.
  //   3. LOCAL, per locale, front-end owned. Projects and testimonials. See
  //      below for why these cannot go in (2).
  const structure = { blog: {}, articles: {}, guides: {} };
  const copyByLocale = {};

  const STRUCTURAL = {
    blog: ["date", "author", "featured", "coverImage"],
    articles: ["date", "author", "listed"],
    guides: ["date", "coverImage", "premium", "order"]
  };
  const COPY = ["title", "excerpt", "seo", "tags", "readingTime", "contentHash"];

  const pick = (entry, keys) =>
    Object.fromEntries(keys.filter((k) => entry[k] !== undefined).map((k) => [k, entry[k]]));

  for (const [type, byLocale] of [
    ["blog", blogByLocale],
    ["articles", articlesByLocale],
    ["guides", guidesByLocale]
  ]) {
    for (const [locale, entries] of Object.entries(byLocale)) {
      for (const entry of entries) {
        // Structure is written from whichever locale reaches it first; it is
        // identical across all of them because every field comes from the one
        // config.json they share.
        structure[type][entry.slug] ??= pick(entry, STRUCTURAL[type]);

        copyByLocale[locale] ??= { blog: {}, articles: {}, guides: {} };
        copyByLocale[locale][type][entry.slug] = pick(entry, COPY);
      }
    }
  }

  const sortKeys = (obj) =>
    Object.fromEntries(
      Object.keys(obj)
        .sort()
        .map((k) => [k, obj[k]])
    );
  for (const type of Object.keys(structure)) structure[type] = sortKeys(structure[type]);

  const structureContent = JSON.stringify(structure);
  const structureHash = computeHash(structureContent);
  writeFile(path.join(STATIC_DIR, `structure-${structureHash}.json`), structureContent);

  const copyHashes = {};
  const localHashes = {};

  const locales = new Set([
    ...Object.keys(copyByLocale),
    ...Object.keys(projectsByLocale),
    ...Object.keys(testimonialsByLocale)
  ]);

  for (const locale of [...locales].sort()) {
    const copy = copyByLocale[locale] ?? { blog: {}, articles: {}, guides: {} };
    for (const type of Object.keys(copy)) copy[type] = sortKeys(copy[type]);

    const copyContent = JSON.stringify(copy);
    const copyHash = computeHash(copyContent);
    copyHashes[locale] = copyHash;
    writeFile(path.join(STATIC_DIR, "copy", locale, `copy-${copyHash}.json`), copyContent);

    // Projects and testimonials stay FRONT-END published, per locale.
    //
    // Not an oversight. A project's per-locale title, description and tags are
    // authored as locale MAPS inside the project's own config.json, and its
    // episodesIndexHash names an artifact this script writes. Testimonials are a
    // per-locale JSON file in the content package. None of that is Markdown, so
    // none of it is in the corpus the i18n repo mirrors, and publishing it from
    // there would mean teaching it a second authoring format it has no source
    // for. So these two are the remaining front-end-owned per-locale objects.
    const local = {
      projects: projectsByLocale[locale] ?? [],
      testimonials: testimonialsByLocale[locale] ?? null
    };
    const localContent = JSON.stringify(local);
    const localHash = computeHash(localContent);
    localHashes[locale] = localHash;
    writeFile(path.join(STATIC_DIR, "meta", locale, `index-${localHash}.json`), localContent);

    // Dev pointers, so `pnpm dev` serves translated listings with no i18n
    // checkout. The COPY pointer is excluded from static:upload (the i18n repo
    // is its single writer on R2); the LOCAL one is uploaded, because this repo
    // is its only writer anywhere.
    if (locale !== DEFAULT_LOCALE) {
      writeFile(path.join(STATIC_DIR, "copy", locale, "current.json"), `${JSON.stringify({ hash: copyHash })}\n`);
      writeFile(path.join(STATIC_DIR, "meta", locale, "current.json"), `${JSON.stringify({ hash: localHash })}\n`);
    }
  }

  return { copyHashes, localHashes, structureHash };
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

  // Write the per-locale metadata artifacts, then the hash manifest naming them
  const contentMeta = writeContentMeta(
    blogByLocale,
    articlesByLocale,
    guidesByLocale,
    projectsByLocale,
    testimonialsByLocale
  );
  writeHashManifest(searchHashes, guideSearchHashes, contentMeta);

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
