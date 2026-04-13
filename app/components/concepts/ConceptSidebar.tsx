import { RelatedConceptsPills } from "@/components/concepts/ConceptPill";
import { RelatedExercises } from "@/components/concepts/RelatedExercises";
import { VideoRecapCard } from "@/components/concepts/VideoRecapCard";
import { UpgradeCard } from "@/components/concepts/UpgradeCard";
import type { ConceptMeta, ExerciseInfo } from "@/types/concepts";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import type { VideoSource } from "@/types/lesson";

interface ConceptSidebarProps {
  conceptSlug: string;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  videoData: VideoSource[] | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus | "locked";
  isAuthenticated: boolean;
}

export function ConceptSidebar({
  conceptSlug,
  relatedConcepts,
  relatedExercises,
  videoData,
  isConceptUnlocked,
  getExerciseStatus,
  isAuthenticated
}: ConceptSidebarProps) {
  return (
    <div>
      {!isAuthenticated && (
        <div className="hidden md:block">
          <UpgradeCard />
        </div>
      )}
      {videoData && videoData.length > 0 && <VideoRecapCard conceptSlug={conceptSlug} videoData={videoData} />}
      <RelatedConceptsPills concepts={relatedConcepts} isUnlocked={isConceptUnlocked} />
      <RelatedExercises exercises={relatedExercises} getStatus={getExerciseStatus} />
    </div>
  );
}
