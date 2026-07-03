"use client";

import { useRouter } from "next/navigation";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { ConceptsLayout } from "@/components/concepts";
import { Breadcrumb } from "@/components/concepts";
import ConceptHero from "@/components/concepts/ConceptHero";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import MarkdownContent from "@/components/content/MarkdownContent";
import { ConceptArticleSkeleton } from "@/components/concepts/LoadingStates";
import { ConceptSidebar } from "@/components/concepts/ConceptSidebar";
import { SignupCta } from "@/components/concepts/SignupCta";
import { ConceptLoadingView } from "@/components/concepts/ConceptLoadingView";
import { ConceptErrorView } from "@/components/concepts/ConceptErrorView";
import { useConceptDetailData, type ConceptDetailSeed } from "@/components/concepts/lib/useConceptDetailData";

interface ConceptLeafViewProps {
  slug: string;
  initialData?: ConceptDetailSeed | null;
}

export function ConceptLeafView({ slug, initialData }: ConceptLeafViewProps) {
  const router = useRouter();
  const routes = useLocaleRoutes();
  const {
    concept,
    ancestors,
    content,
    isContentLoading,
    relatedConcepts,
    relatedExercises,
    relatedProjects,
    videoData,
    isConceptUnlocked,
    getExerciseStatus,
    getProjectStatus,
    isAuthenticated,
    isLoading,
    error
  } = useConceptDetailData(slug, initialData);

  if (isLoading) {
    return <ConceptLoadingView />;
  }

  if (error || !concept) {
    return <ConceptErrorView message={error} onBack={() => router.push(routes.concepts())} />;
  }

  return (
    <>
      <ConceptsLayout>
        <ConceptLayout
          breadcrumb={<Breadcrumb conceptTitle={concept.title} ancestors={ancestors} />}
          rightPanel={
            <ConceptSidebar
              conceptSlug={concept.slug}
              relatedConcepts={relatedConcepts}
              relatedExercises={relatedExercises}
              relatedProjects={relatedProjects}
              videoData={videoData}
              isConceptUnlocked={isConceptUnlocked}
              getExerciseStatus={getExerciseStatus}
              getProjectStatus={getProjectStatus}
              isAuthenticated={isAuthenticated}
            />
          }
        >
          <ConceptHero title={concept.title} intro={concept.description} />
          {isContentLoading && <ConceptArticleSkeleton />}
          {content && <MarkdownContent content={content} variant="base" />}
        </ConceptLayout>
      </ConceptsLayout>
      {!isAuthenticated && content && <SignupCta />}
    </>
  );
}
