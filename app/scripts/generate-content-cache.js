#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Content Cache Generation Script
 *
 * Processes markdown files from the content package and produces:
 *
 *   public/static/content/blog/{locale}-{hash}.json
 *     - Metadata index: all blog posts with slug, title, date, etc.
 *
 *   public/static/content/blog/{slug}/{locale}-{hash}.html
 *     - Content files: pre-rendered HTML from markdown
 *
 *   public/static/content/articles/{locale}-{hash}.json
 *     - Metadata index: all articles
 *
 *   public/static/content/articles/{slug}/{locale}-{hash}.html
 *     - Content files: pre-rendered HTML from markdown
 *
 *   public/static/content/search/articles-{locale}-{hash}.json
 *     - Lunr search indexes for articles
 *
 *   lib/generated/content-hashes.ts
 *     - Hash manifest mapping type+locale -> metadata index hash
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
import lunr from "lunr";

marked.use(markedFootnote());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../../content/src/posts");
const AUTHORS_FILE = path.join(__dirname, "../../content/src/authors.json");
const IMAGES_SRC_DIR = path.join(__dirname, "../../content/images");
const STATIC_DIR = path.join(__dirname, "../public/static/content");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

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
 * Compute a 12-char SHA-256 hash of content
 */
function computeHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 12);
}

/**
 * Write a file, creating directories as needed
 */
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

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
 * Rewrite markdown image paths ("/images/...") to their fingerprinted URLs.
 */
function fixImagePaths(content) {
  return content.replace(
    /!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g,
    (_match, alt, imagePath) => `![${alt}](${hashAndCopyImage(imagePath)})`
  );
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

  const slugDirs = fs.readdirSync(contentDir, { withFileTypes: true }).filter((d) => d.isDirectory());

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

        const rawAuthor = authorsData[config.author];
        if (!rawAuthor) {
          throw new Error(`Author not found: ${config.author} in ${filePath}`);
        }
        const author = fixAuthorAvatar(rawAuthor);

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
          author,
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
 * Process the build/ directory.
 *
 * Structure:
 *   build/
 *     config.json                 — { series: ["slug1", "slug2", ...] } (ordered)
 *     {series-slug}/
 *       config.json               — series details + episodes: [uuid, ...] (ordered)
 *       {uuid}/
 *         config.json             — episode metadata (no series, no order)
 *         {locale}.md             — episode content per locale
 *
 * Returns: { seriesData, episodes: [{ uuid, seriesSlug, order, config, locales }] }
 *   where seriesData.series is an ordered array of { slug, ...details }
 */
function processBuild() {
  const buildDir = path.join(CONTENT_DIR, "build");
  if (!fs.existsSync(buildDir)) {
    return null;
  }

  const topConfigPath = path.join(buildDir, "config.json");
  if (!fs.existsSync(topConfigPath)) {
    throw new Error(`Missing build/config.json at ${topConfigPath}`);
  }

  let topConfig;
  try {
    topConfig = JSON.parse(fs.readFileSync(topConfigPath, "utf-8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${topConfigPath}: ${error.message}`);
  }

  if (!Array.isArray(topConfig.series)) {
    throw new Error(`build/config.json must have a "series" array of slugs`);
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const requiredEpisodeFields = ["slug", "date", "author", "videoProvider", "videoKey", "durationSeconds", "image"];

  const seriesList = [];
  const episodes = [];
  const seenUuids = new Set();
  const seenSeriesSlugs = new Set();

  for (const seriesSlug of topConfig.series) {
    if (typeof seriesSlug !== "string" || !seriesSlug) {
      throw new Error(`build/config.json "series" entries must be non-empty slug strings`);
    }
    if (seenSeriesSlugs.has(seriesSlug)) {
      throw new Error(`Duplicate series slug in build/config.json: "${seriesSlug}"`);
    }
    seenSeriesSlugs.add(seriesSlug);

    const seriesDir = path.join(buildDir, seriesSlug);
    if (!fs.existsSync(seriesDir) || !fs.statSync(seriesDir).isDirectory()) {
      throw new Error(`Series "${seriesSlug}" listed in build/config.json has no directory at ${seriesDir}`);
    }

    const seriesConfigPath = path.join(seriesDir, "config.json");
    if (!fs.existsSync(seriesConfigPath)) {
      throw new Error(`Missing config.json for series "${seriesSlug}" at ${seriesConfigPath}`);
    }

    let seriesConfig;
    try {
      seriesConfig = JSON.parse(fs.readFileSync(seriesConfigPath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${seriesConfigPath}: ${error.message}`);
    }

    if (!Array.isArray(seriesConfig.episodes)) {
      throw new Error(`Series "${seriesSlug}" config.json must have an "episodes" array of UUIDs`);
    }
    if (typeof seriesConfig.image !== "string" || !seriesConfig.image) {
      throw new Error(`Series "${seriesSlug}" is missing required "image" field`);
    }

    seriesList.push({ slug: seriesSlug, ...seriesConfig });

    const slugsInSeries = new Set();
    for (let i = 0; i < seriesConfig.episodes.length; i++) {
      const uuid = seriesConfig.episodes[i];
      if (typeof uuid !== "string" || !uuidPattern.test(uuid)) {
        throw new Error(`Series "${seriesSlug}" episodes[${i}] is not a valid UUID: ${uuid}`);
      }
      const uuidLower = uuid.toLowerCase();
      if (seenUuids.has(uuidLower)) {
        throw new Error(`Duplicate build episode UUID across series: ${uuid}`);
      }
      seenUuids.add(uuidLower);

      const dirPath = path.join(seriesDir, uuid);
      if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        throw new Error(`Series "${seriesSlug}" references missing episode directory: ${dirPath}`);
      }

      const configPath = path.join(dirPath, "config.json");
      if (!fs.existsSync(configPath)) {
        throw new Error(`Missing config.json for build episode ${uuid}`);
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

      if (slugsInSeries.has(config.slug)) {
        throw new Error(`Duplicate episode slug "${config.slug}" in series "${seriesSlug}"`);
      }
      slugsInSeries.add(config.slug);

      const order = i + 1;
      const configJson = JSON.stringify({ ...config, series: seriesSlug, order });

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

          const hashInput = crypto.createHash("sha256");
          hashInput.update(fileContent);
          hashInput.update(configJson);
          hashInput.update(authorsJson);
          const contentHash = hashInput.digest("hex").slice(0, 12);

          const meta = {
            uuid,
            slug: config.slug,
            series: seriesSlug,
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

      episodes.push({ uuid, seriesSlug, order, config, locales: localesOut });
    }
  }

  return { seriesData: { series: seriesList }, episodes };
}

/**
 * Build static files for the build/ section.
 *
 * Emits:
 *   - public/static/content/build/{seriesSlug}/{uuid}/{locale}-{htmlHash}.html
 *   - public/static/content/build/{seriesSlug}/episodes-{locale}-{indexHash}.json
 *
 * Returns: { buildByLocale } where buildByLocale[locale] = [seriesEntry], each seriesEntry
 *   contains slug, order, title, description, episodeCount, episodesIndexHash.
 */
function buildBuildStaticFiles(processed) {
  if (!processed) {
    return { buildByLocale: {} };
  }

  const { seriesData, episodes } = processed;

  // episodesBy[locale][seriesSlug] = [episodeMeta]
  const episodesBy = {};

  for (const episode of episodes) {
    for (const [locale, { meta, html }] of Object.entries(episode.locales)) {
      const htmlHash = computeHash(html);
      const htmlPath = path.join(STATIC_DIR, "build", meta.series, episode.uuid, `${locale}-${htmlHash}.html`);
      writeFile(htmlPath, html);

      const finalMeta = { ...meta, contentHash: htmlHash };

      if (!episodesBy[locale]) {
        episodesBy[locale] = {};
      }
      if (!episodesBy[locale][meta.series]) {
        episodesBy[locale][meta.series] = [];
      }
      episodesBy[locale][meta.series].push(finalMeta);
    }
  }

  const buildByLocale = {};

  // Determine all locales that have any series content. Series titles only use
  // locales declared in series.json title maps; episodes contribute locales too.
  const allLocales = new Set();
  for (const s of seriesData.series) {
    for (const loc of Object.keys(s.title || {})) {
      allLocales.add(loc);
    }
  }
  for (const loc of Object.keys(episodesBy)) {
    allLocales.add(loc);
  }

  for (const locale of allLocales) {
    buildByLocale[locale] = [];

    let order = 0;
    for (const series of seriesData.series) {
      order += 1;
      const title = (series.title && (series.title[locale] || series.title.en)) || series.slug;
      const description = (series.description && (series.description[locale] || series.description.en)) || "";
      const audience = (series.audience && (series.audience[locale] || series.audience.en)) || "";
      const cadence = (series.cadence && (series.cadence[locale] || series.cadence.en)) || "";
      const upcomingStreams = Array.isArray(series.upcoming_streams) ? series.upcoming_streams : [];
      if (typeof series.image !== "string" || !series.image) {
        throw new Error(`Series "${series.slug}" is missing required "image" field`);
      }
      const image = series.image;
      const status = series.status ?? "live";
      if (status !== "live" && status !== "pending") {
        throw new Error(`Series "${series.slug}" has invalid status "${status}" (expected "live" or "pending")`);
      }
      if (typeof series.livestream !== "boolean") {
        throw new Error(`Series "${series.slug}" is missing required boolean "livestream" field`);
      }
      const livestream = series.livestream;

      const seriesEpisodes = (episodesBy[locale] && episodesBy[locale][series.slug]) || [];
      const sortedEpisodes = [...seriesEpisodes].sort((a, b) => a.order - b.order);

      const indexJson = JSON.stringify(sortedEpisodes);
      const indexHash = computeHash(indexJson);
      const indexPath = path.join(STATIC_DIR, "build", series.slug, `episodes-${locale}-${indexHash}.json`);
      writeFile(indexPath, indexJson);

      buildByLocale[locale].push({
        slug: series.slug,
        order,
        title,
        description,
        audience,
        cadence,
        image,
        status,
        livestream,
        upcomingStreams,
        episodeCount: sortedEpisodes.length,
        episodesIndexHash: indexHash,
        locale
      });
    }
  }

  return { buildByLocale };
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
      const contentPath = path.join(STATIC_DIR, type, slug, `${locale}-${htmlHash}.html`);
      writeFile(contentPath, html);

      // Use the HTML hash as contentHash in the index (for URL construction)
      byLocale[locale].push({ ...meta, contentHash: htmlHash });
    }
  }

  // Write metadata indexes and collect hashes
  const indexHashes = {};

  for (const [locale, entries] of Object.entries(byLocale)) {
    const indexContent = JSON.stringify(entries);
    const indexHash = computeHash(indexContent);
    indexHashes[locale] = indexHash;

    const indexPath = path.join(STATIC_DIR, type, `${locale}-${indexHash}.json`);
    writeFile(indexPath, indexContent);
  }

  return { indexHashes, byLocale };
}

/**
 * Generate Lunr search indexes for articles (one per locale)
 * Returns search index hashes per locale
 */
function generateSearchIndexes(articlesByLocale) {
  const searchHashes = {};

  for (const [locale, articles] of Object.entries(articlesByLocale)) {
    const listedArticles = articles.filter((a) => a.listed);

    const idx = lunr(function () {
      this.ref("slug");
      this.field("title", { boost: 10 });
      this.field("excerpt", { boost: 5 });
      this.field("description", { boost: 4 });
      this.field("keywords", { boost: 3 });

      for (const article of listedArticles) {
        this.add({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          description: article.seo.description,
          keywords: article.seo.keywords.join(" ")
        });
      }
    });

    const metadata = listedArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt
    }));

    const output = JSON.stringify({ index: idx.toJSON(), articles: metadata });
    const searchHash = computeHash(output);
    searchHashes[locale] = searchHash;

    const searchPath = path.join(STATIC_DIR, "search", `articles-${locale}-${searchHash}.json`);
    writeFile(searchPath, output);
    console.log(`   Search index: articles-${locale}-${searchHash}.json (${listedArticles.length} articles)`);
  }

  return searchHashes;
}

/**
 * Write the TypeScript hash manifest
 */
function writeHashManifest(blogHashes, articleHashes, searchHashes, buildEpisodesHashes) {
  function formatEntries(hashes) {
    return Object.entries(hashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([locale, hash]) => `    ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
      .join(",\n");
  }

  function formatNestedEntries(nested) {
    return Object.entries(nested)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([seriesSlug, byLocale]) =>
          `    ${JSON.stringify(seriesSlug)}: {\n${Object.entries(byLocale)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([locale, hash]) => `      ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
            .join(",\n")}\n    }`
      )
      .join(",\n");
  }

  const content = `// Auto-generated by scripts/generate-content-cache.js — DO NOT EDIT
export const contentIndexHashes: {
  blog: Record<string, string>;
  articles: Record<string, string>;
  search: Record<string, string>;
  buildEpisodes: Record<string, Record<string, string>>;
} = {
  blog: {
${formatEntries(blogHashes)},
  },
  articles: {
${formatEntries(articleHashes)},
  },
  search: {
${formatEntries(searchHashes)},
  },
  buildEpisodes: {
${formatNestedEntries(buildEpisodesHashes)},
  },
};
`;

  writeFile(path.join(GENERATED_DIR, "content-hashes.ts"), content);
}

/**
 * Write the server-side metadata JSON
 * Contains full metadata for all blog posts and articles (no HTML content)
 */
function writeServerMeta(blogByLocale, articlesByLocale, buildByLocale) {
  const serverMeta = {
    blog: {},
    articles: {},
    build: { series: {} },
    locales: {
      blog: Object.keys(blogByLocale).sort(),
      articles: Object.keys(articlesByLocale).sort(),
      build: Object.keys(buildByLocale).sort()
    },
    slugsWithLocales: {
      blog: [],
      articles: []
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

  for (const [locale, seriesList] of Object.entries(buildByLocale)) {
    serverMeta.build.series[locale] = seriesList;
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

  // Process build series + episodes
  const buildProcessed = processBuild();

  // Build static files
  const { indexHashes: blogHashes, byLocale: blogByLocale } = buildStaticFiles("blog", blog);
  const { indexHashes: articleHashes, byLocale: articlesByLocale } = buildStaticFiles("articles", articles);
  const { buildByLocale } = buildBuildStaticFiles(buildProcessed);

  // Generate search indexes
  const searchHashes = generateSearchIndexes(articlesByLocale);

  // Per-series episode-list hash manifest, keyed seriesSlug -> locale -> hash
  const buildEpisodesHashes = {};
  for (const [locale, seriesList] of Object.entries(buildByLocale)) {
    for (const series of seriesList) {
      if (!buildEpisodesHashes[series.slug]) {
        buildEpisodesHashes[series.slug] = {};
      }
      buildEpisodesHashes[series.slug][locale] = series.episodesIndexHash;
    }
  }

  // Write hash manifest
  writeHashManifest(blogHashes, articleHashes, searchHashes, buildEpisodesHashes);

  // Write server-side metadata
  writeServerMeta(blogByLocale, articlesByLocale, buildByLocale);

  // Count totals
  let contentFileCount = 0;
  for (const locales of Object.values(blog)) {
    contentFileCount += Object.keys(locales).length;
  }
  for (const locales of Object.values(articles)) {
    contentFileCount += Object.keys(locales).length;
  }

  const buildEpisodeCount = buildProcessed
    ? buildProcessed.episodes.reduce((acc, ep) => acc + Object.keys(ep.locales).length, 0)
    : 0;
  const buildSeriesCount = buildProcessed ? buildProcessed.seriesData.series.length : 0;

  console.log("\nContent cache generated successfully:\n");
  console.log(`   Blog posts: ${Object.keys(blog).length} slugs`);
  console.log(`   Articles: ${Object.keys(articles).length} slugs`);
  console.log(`   Build series: ${buildSeriesCount}`);
  console.log(`   Build episodes: ${buildEpisodeCount} (locale-files)`);
  console.log(`   Content files: ${contentFileCount}`);
  console.log(
    `   Locales: ${[
      ...new Set([...Object.keys(blogByLocale), ...Object.keys(articlesByLocale), ...Object.keys(buildByLocale)])
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
