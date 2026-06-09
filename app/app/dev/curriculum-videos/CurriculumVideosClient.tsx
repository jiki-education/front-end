"use client";

import JikiMuxPlayer from "@/components/ui/JikiMuxPlayer";

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Curriculum Videos</h1>
        <p className="text-gray-600 mb-6">
          {videos.length} videos across {Object.keys(grouped).length} levels, sourced from{" "}
          <code className="bg-gray-200 px-1 rounded">api/db/seeds/curriculum.json</code>.
        </p>

        {Object.entries(grouped).map(([key, entries]) => {
          const [, levelTitle] = key.split("::");
          return (
            <section key={key} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{levelTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entries.map((entry, idx) => (
                  <div key={`${entry.lessonSlug}-${entry.source.id}-${idx}`} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{entry.lessonTitle}</h3>
                        <p className="text-xs text-gray-500 font-mono">{entry.lessonSlug}</p>
                      </div>
                      {entry.kind === "walkthrough" && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">walkthrough</span>
                      )}
                    </div>
                    <div className="aspect-video bg-black rounded overflow-hidden">
                      {entry.source.provider === "mux" ? (
                        <JikiMuxPlayer playbackId={entry.source.id} autoPlay={false} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white text-sm">
                          Unsupported provider: {entry.source.provider}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-mono break-all">
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
