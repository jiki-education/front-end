import { ConceptsLayout } from "@/components/concepts";
import { Breadcrumb } from "@/components/concepts";
import ConceptHero from "@/components/concepts/ConceptHero";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import MarkdownContent from "@/components/content/MarkdownContent";
import { ConceptArticleSkeleton } from "@/components/concepts/LoadingStates";
import { ConceptSidebar } from "@/components/concepts/ConceptSidebar";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import type { VideoSource } from "@/types/lesson";

interface ConceptLeafViewProps {
  concept: ConceptMeta;
  ancestors: ConceptAncestor[];
  content: string | null;
  isContentLoading: boolean;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  videoData: VideoSource[] | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus | "locked";
}

export function ConceptLeafView({
  concept,
  ancestors,
  content,
  isContentLoading,
  relatedConcepts,
  relatedExercises,
  videoData,
  isConceptUnlocked,
  getExerciseStatus
}: ConceptLeafViewProps) {
  return (
    <ConceptsLayout>
      <ConceptLayout
        breadcrumb={<Breadcrumb conceptTitle={concept.title} ancestors={ancestors} />}
        rightPanel={
          <ConceptSidebar
            conceptSlug={concept.slug}
            relatedConcepts={relatedConcepts}
            relatedExercises={relatedExercises}
            videoData={videoData}
            isConceptUnlocked={isConceptUnlocked}
            getExerciseStatus={getExerciseStatus}
          />
        }
      >
        <ConceptHero title={concept.title} intro={concept.description} />
        {isContentLoading && <ConceptArticleSkeleton />}
        {content && <MarkdownContent content={content} variant="base" />}
      </ConceptLayout>
    </ConceptsLayout>
  );
}
