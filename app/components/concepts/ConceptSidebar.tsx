import { RelatedConceptsPills } from "@/components/concepts/ConceptPill";
import { RelatedExercises } from "@/components/concepts/RelatedExercises";
import { VideoRecapCard } from "@/components/concepts/VideoRecapCard";
import type { ConceptMeta, ExerciseInfo } from "@/types/concepts";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import type { VideoData } from "@/types/lesson";

interface ConceptSidebarProps {
  conceptSlug: string;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  videoData: VideoData[] | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus | "locked";
}

export function ConceptSidebar({
  conceptSlug,
  relatedConcepts,
  relatedExercises,
  videoData,
  isConceptUnlocked,
  getExerciseStatus
}: ConceptSidebarProps) {
  return (
    <div>
      {videoData && videoData.length > 0 && <VideoRecapCard conceptSlug={conceptSlug} videoData={videoData} />}
      <RelatedExercises exercises={relatedExercises} getStatus={getExerciseStatus} />
      <RelatedConceptsPills concepts={relatedConcepts} isUnlocked={isConceptUnlocked} />
    </div>
  );
}
