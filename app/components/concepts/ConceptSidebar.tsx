import { RelatedConceptsPills } from "@/components/concepts/ConceptPill";
import { RelatedChallenges } from "@/components/concepts/RelatedChallenges";
import { RelatedExercises } from "@/components/concepts/RelatedExercises";
import { ShareLinks } from "@/components/ui/ShareLinks/ShareLinks";
import { UpgradeCard } from "@/components/ui/UpgradeCard/UpgradeCard";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { VideoRecapCard } from "@/components/concepts/VideoRecapCard";
import type { ChallengeStatus } from "@/lib/api/challenges";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import type { ConceptMeta, ExerciseInfo, ChallengeInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";
import styles from "./ConceptSidebar.module.css";

interface ConceptSidebarProps {
  conceptSlug: string;
  conceptTitle: string;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  relatedChallenges: ChallengeInfo[];
  video: VideoSource | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus;
  getChallengeStatus: (slug: string) => ChallengeStatus | "locked";
  isAuthenticated: boolean;
}

export function ConceptSidebar({
  conceptSlug,
  conceptTitle,
  relatedConcepts,
  relatedExercises,
  relatedChallenges,
  video,
  isConceptUnlocked,
  getExerciseStatus,
  getChallengeStatus,
  isAuthenticated
}: ConceptSidebarProps) {
  const routes = useLocaleRoutes();

  return (
    <div>
      {!isAuthenticated && (
        <div className={styles.desktopOnly}>
          <UpgradeCard />
        </div>
      )}
      {video && <VideoRecapCard conceptSlug={conceptSlug} video={video} isAuthenticated={isAuthenticated} />}
      <ShareLinks subject="concept" title={conceptTitle} path={routes.concept(conceptSlug)} />
      <RelatedConceptsPills concepts={relatedConcepts} isUnlocked={isConceptUnlocked} />
      <RelatedExercises exercises={relatedExercises} getStatus={getExerciseStatus} isAuthenticated={isAuthenticated} />
      <RelatedChallenges challenges={relatedChallenges} getStatus={getChallengeStatus} />
    </div>
  );
}
