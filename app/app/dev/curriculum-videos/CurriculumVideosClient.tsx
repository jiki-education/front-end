"use client";

import JikiMuxPlayer from "@/components/ui/JikiMuxPlayer";
import styles from "./page.module.css";

interface VideoSource {
  provider: string;
  id: string;
  durationSeconds: number;
  uploadDate: string;
}

/** The authored catalog: video slug -> locale (or "fallback") -> source. */
export type VideoCatalog = Record<string, Record<string, VideoSource>>;

interface VideoEntry {
  slug: string;
  locale: string;
  source: VideoSource;
}

function collectVideos(catalog: VideoCatalog): VideoEntry[] {
  const entries: VideoEntry[] = [];
  for (const [slug, localeMap] of Object.entries(catalog)) {
    for (const [locale, source] of Object.entries(localeMap)) {
      entries.push({ slug, locale, source });
    }
  }
  return entries;
}

export default function CurriculumVideosClient({ catalog }: { catalog: VideoCatalog }) {
  const videos = collectVideos(catalog);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Curriculum Videos</h1>
        <p className={styles.intro}>
          {videos.length} recordings across {Object.keys(catalog).length} videos, sourced from{" "}
          <code className={styles.inlineCode}>curriculum/src/videos/videos.json</code>.
        </p>

        <div className={styles.grid}>
          {videos.map((entry) => (
            <div key={`${entry.slug}-${entry.locale}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.lessonTitle}>{entry.slug}</h3>
                  <p className={styles.lessonSlug}>
                    {entry.source.uploadDate} · {entry.source.durationSeconds}s
                  </p>
                </div>
                <span className={styles.walkthroughTag}>{entry.locale}</span>
              </div>
              <div className={styles.videoWrapper}>
                {entry.source.provider === "mux" ? (
                  <JikiMuxPlayer playbackId={entry.source.id} autoPlay={false} />
                ) : (
                  <div className={styles.unsupported}>Unsupported provider: {entry.source.provider}</div>
                )}
              </div>
              <p className={styles.sourceMeta}>
                {entry.source.provider}:{entry.source.id}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
