import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import PublicExercisePage from "@/components/exercises/PublicExercisePage";
import { getExerciseInstructionsServer, getExerciseMetaServer } from "@/lib/api/exercise-meta-server";
import { getExerciseMetadata } from "@/lib/exercises/metadata";
import { exerciseInstructionsHtml } from "@/lib/exercises/instructions";
import { breadcrumbSchema, exerciseLearningResourceSchema, videoObjectSchema } from "@/lib/seo/schemas";
import { getConceptsForExerciseServer } from "@/lib/concepts/server-concepts";
import { getVideoIndexServer } from "@/lib/videos/server-videos";
import { videoFor } from "@/lib/videos/select";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  return getExerciseMetadata(slug, locale);
}

/**
 * The public face of an exercise.
 *
 * Everything renders on the server so logged-out visitors (and crawlers) get the
 * whole teaser in the initial HTML. Signed-in visitors are bounced from the
 * client to the exercise itself, or to the dashboard when they haven't unlocked
 * it — a decision that needs their progress, which only the browser can fetch.
 */
export default async function PublicExerciseRoute({ params }: Props) {
  const { slug, locale } = await params;

  const exercise = await getExerciseMetaServer(slug, locale);
  if (!exercise) {
    notFound();
  }

  const [instructions, videos, concepts] = await Promise.all([
    getExerciseInstructionsServer(slug, locale, exercise.proseHash),
    getVideoIndexServer(locale),
    getConceptsForExerciseServer(slug, locale)
  ]);
  const instructionsHtml = instructions ? exerciseInstructionsHtml(instructions) : "";
  const video = videoFor(videos, slug);

  const jsonLd = [
    exerciseLearningResourceSchema(exercise, locale),
    ...(video
      ? [
          videoObjectSchema({
            path: `/exercises/${exercise.slug}`,
            locale,
            name: exercise.title,
            description: exercise.description,
            uploadDate: video.uploadDate,
            durationSeconds: video.durationSeconds,
            provider: video.provider,
            videoKey: video.id,
            isAccessibleForFree: true
          })
        ]
      : []),
    breadcrumbSchema([{ name: exercise.title, path: `/exercises/${exercise.slug}` }], locale)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicExercisePage
        slug={exercise.slug}
        title={exercise.title}
        description={exercise.description}
        instructionsHtml={instructionsHtml}
        video={video}
        concepts={concepts}
      />
    </>
  );
}
