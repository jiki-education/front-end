import { RelatedConceptsPills } from "@/components/concepts/ConceptPill";
import { RelatedExercises } from "@/components/concepts/RelatedExercises";
import { RelatedProjects } from "@/components/concepts/RelatedProjects";
import { VideoRecapCard } from "@/components/concepts/VideoRecapCard";
import { UpgradeCard } from "@/components/concepts/UpgradeCard";
import type { ConceptMeta, ExerciseInfo, ProjectInfo } from "@/types/concepts";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import type { ProjectStatus } from "@/lib/api/projects";
import type { VideoSource } from "@/types/lesson";

interface ConceptSidebarProps {
  conceptSlug: string;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  relatedProjects: ProjectInfo[];
  videoData: VideoSource[] | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus | "locked";
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
        <div className="hidden md:block">
          <UpgradeCard />
        </div>
      )}
      {videoData && videoData.length > 0 && <VideoRecapCard conceptSlug={conceptSlug} videoData={videoData} />}
      <RelatedConceptsPills concepts={relatedConcepts} isUnlocked={isConceptUnlocked} />
      <RelatedExercises exercises={relatedExercises} getStatus={getExerciseStatus} />
      <RelatedProjects projects={relatedProjects} getStatus={getProjectStatus} />
    </div>
  );
}
