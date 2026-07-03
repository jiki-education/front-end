import { RelatedConceptsPills } from "@/components/concepts/ConceptPill";
import { RelatedExercises } from "@/components/concepts/RelatedExercises";
import { RelatedProjects } from "@/components/concepts/RelatedProjects";
import { VideoRecapCard } from "@/components/concepts/VideoRecapCard";
import { UpgradeCard } from "@/components/concepts/UpgradeCard";
import type { ConceptMeta, ExerciseInfo, ProjectInfo } from "@/types/concepts";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import type { ProjectStatus } from "@/lib/api/projects";
import type { VideoSource } from "@/types/lesson";
import styles from "./ConceptSidebar.module.css";

interface ConceptSidebarProps {
  conceptSlug: string;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  relatedProjects: ProjectInfo[];
  videoData: VideoSource[] | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus;
  getProjectStatus: (slug: string) => ProjectStatus | "locked";
  isAuthenticated: boolean;
}

export function ConceptSidebar({
  conceptSlug,
  relatedConcepts,
  relatedExercises,
  relatedProjects,
  videoData,
  isConceptUnlocked,
  getExerciseStatus,
  getProjectStatus,
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
      <RelatedProjects projects={relatedProjects} getStatus={getProjectStatus} />
    </div>
  );
}
