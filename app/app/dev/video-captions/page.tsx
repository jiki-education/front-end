import fs from "node:fs";
import path from "node:path";
import VideoCaptionsClient, { type CaptionVideo } from "./VideoCaptionsClient";

export const dynamic = "force-dynamic";

const APP_DIR = process.cwd();
const I18N_REPO = path.resolve(process.env.JIKI_I18N_REPO || path.join(APP_DIR, "..", "..", "i18n"));
const CURRICULUM = path.resolve(APP_DIR, "../../api/db/seeds/curriculum.json");

interface CurriculumFile {
  levels: {
    lessons?: { slug: string; type: string; data?: { sources?: { id: string }[] } }[];
  }[];
}

/**
 * Video lessons that have both a Mux playback id (from the curriculum seed) and
 * at least one translated subtitle file (from the i18n repo), plus the locales
 * each one is translated into.
 *
 * The two repos are joined on the video slug, which is the lesson slug in the
 * curriculum and the video directory name in i18n.
 */
function loadVideos(): { videos: CaptionVideo[]; i18nRepo: string; i18nPresent: boolean } {
  if (!fs.existsSync(I18N_REPO) || !fs.existsSync(CURRICULUM)) {
    return { videos: [], i18nRepo: I18N_REPO, i18nPresent: false };
  }

  const curriculum = JSON.parse(fs.readFileSync(CURRICULUM, "utf8")) as CurriculumFile;
  const playbackIds = new Map<string, string>();
  for (const level of curriculum.levels) {
    for (const lesson of level.lessons ?? []) {
      const source = lesson.type === "video" ? lesson.data?.sources?.[0] : undefined;
      if (source?.id) {
        playbackIds.set(lesson.slug, source.id);
      }
    }
  }

  const localesDir = path.join(I18N_REPO, "locales");
  const locales = fs
    .readdirSync(localesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "source")
    .map((entry) => entry.name);

  const bySlug = new Map<string, string[]>();
  for (const locale of locales) {
    const videosDir = path.join(localesDir, locale, "videos");
    if (!fs.existsSync(videosDir)) {
      continue;
    }
    for (const slug of fs.readdirSync(videosDir)) {
      if (!playbackIds.has(slug)) {
        continue;
      }
      if (fs.existsSync(path.join(videosDir, slug, "subtitles.vtt"))) {
        bySlug.set(slug, [...(bySlug.get(slug) ?? []), locale]);
      }
    }
  }

  const videos = [...bySlug.entries()]
    .map(([slug, slugLocales]) => ({
      slug,
      playbackId: playbackIds.get(slug)!,
      locales: slugLocales.sort()
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return { videos, i18nRepo: I18N_REPO, i18nPresent: true };
}

export default function VideoCaptionsDevPage() {
  const { videos, i18nRepo, i18nPresent } = loadVideos();
  return <VideoCaptionsClient videos={videos} i18nRepo={i18nRepo} i18nPresent={i18nPresent} />;
}
