"use client";

import JikiVideoPlayer from "@/components/ui/JikiVideoPlayer";
import styles from "./page.module.css";

interface VideoSource {
  provider: string;
  id: string;
  language?: string;
}

interface CurriculumLesson {
  slug: string;
  title: string;
  type: string;
  data?: { sources?: VideoSource[] } | Record<string, unknown>;
  walkthrough_video_data?: VideoSource[] | null;
}

export interface CurriculumLevel {
  slug: string;
  title: string;
  lessons: CurriculumLesson[];
}

interface VideoEntry {
  levelTitle: string;
  levelSlug: string;
  lessonTitle: string;
  lessonSlug: string;
  source: VideoSource;
  kind: "video" | "walkthrough";
}

function collectVideos(levels: CurriculumLevel[]): VideoEntry[] {
  const entries: VideoEntry[] = [];
  for (const level of levels) {
    for (const lesson of level.lessons) {
      if (lesson.type === "video" && lesson.data && "sources" in lesson.data) {
        const sources = (lesson.data as { sources?: VideoSource[] }).sources ?? [];
        for (const source of sources) {
          entries.push({
            levelTitle: level.title,
            levelSlug: level.slug,
            lessonTitle: lesson.title,
            lessonSlug: lesson.slug,
            source,
            kind: "video"
          });
        }
      }
      if (lesson.walkthrough_video_data) {
        for (const source of lesson.walkthrough_video_data) {
          entries.push({
            levelTitle: level.title,
            levelSlug: level.slug,
            lessonTitle: lesson.title,
            lessonSlug: lesson.slug,
            source,
            kind: "walkthrough"
          });
        }
      }
    }
  }
  return entries;
}

export default function CurriculumVideosClient({ levels }: { levels: CurriculumLevel[] }) {
  const videos = collectVideos(levels);

  const grouped = videos.reduce<Record<string, VideoEntry[]>>((acc, entry) => {
    const key = `${entry.levelSlug}::${entry.levelTitle}`;
    (acc[key] ??= []).push(entry);
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Curriculum Videos</h1>
        <p className={styles.intro}>
          {videos.length} videos across {Object.keys(grouped).length} levels, sourced from{" "}
          <code className={styles.inlineCode}>api/db/seeds/curriculum.json</code>.
        </p>

        {Object.entries(grouped).map(([key, entries]) => {
          const [, levelTitle] = key.split("::");
          return (
            <section key={key} className={styles.level}>
              <h2 className={styles.levelTitle}>{levelTitle}</h2>
              <div className={styles.grid}>
                {entries.map((entry, idx) => (
                  <div key={`${entry.lessonSlug}-${entry.source.id}-${idx}`} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div>
                        <h3 className={styles.lessonTitle}>{entry.lessonTitle}</h3>
                        <p className={styles.lessonSlug}>{entry.lessonSlug}</p>
                      </div>
                      {entry.kind === "walkthrough" && <span className={styles.walkthroughTag}>walkthrough</span>}
                    </div>
                    <div className={styles.videoWrapper}>
                      {entry.source.provider === "mux" ? (
                        <JikiVideoPlayer playbackId={entry.source.id} autoPlay={false} />
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
