import { RelatedConceptsPills } from "@/components/concepts/ConceptPill";
import { RelatedChallenges } from "@/components/concepts/RelatedChallenges";
import { RelatedExercises } from "@/components/concepts/RelatedExercises";
import { UpgradeCard } from "@/components/concepts/UpgradeCard";
import { VideoRecapCard } from "@/components/concepts/VideoRecapCard";
import type { ChallengeStatus } from "@/lib/api/challenges";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import type { ConceptMeta, ExerciseInfo, ChallengeInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";
import styles from "./ConceptSidebar.module.css";

interface ConceptSidebarProps {
  conceptSlug: string;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  relatedChallenges: ChallengeInfo[];
  videoData: VideoSource[] | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus;
  getChallengeStatus: (slug: string) => ChallengeStatus | "locked";
  isAuthenticated: boolean;
}

export function ConceptSidebar({
  conceptSlug,
  relatedConcepts,
  relatedExercises,
  relatedChallenges,
  videoData,
  isConceptUnlocked,
  getExerciseStatus,
  getChallengeStatus,
  isAuthenticated
}: ConceptSidebarProps) {
  return (
    <div>
      {!isAuthenticated && (
        <div className={styles.desktopOnly}>
          <UpgradeCard />
        </div>
      )}
      {videoData && videoData.length > 0 && (
        <VideoRecapCard conceptSlug={conceptSlug} videoData={videoData} isAuthenticated={isAuthenticated} />
      )}
      <RelatedConceptsPills concepts={relatedConcepts} isUnlocked={isConceptUnlocked} />
      <RelatedExercises exercises={relatedExercises} getStatus={getExerciseStatus} isAuthenticated={isAuthenticated} />
      <RelatedChallenges challenges={relatedChallenges} getStatus={getChallengeStatus} />
    </div>
  );
}
