"use client";

import type { ProcessedGuide, GuideMeta } from "@/lib/content/types";
import { ConceptsLayout } from "@/components/concepts";
import GuideBody from "./GuideBody";
import GuideBreadcrumb from "./GuideBreadcrumb";
import GuideHero from "./GuideHero";
import GuideLayout from "./GuideLayout";
import RelatedGuides from "./RelatedGuides";
import PremiumGuideGate from "./PremiumGuideGate";

interface GuideDetailContentProps {
  guide: ProcessedGuide;
  relatedGuides?: GuideMeta[];
  locale: string;
}

export default function GuideDetailContent({ guide, relatedGuides = [], locale }: GuideDetailContentProps) {
  // Premium guides render through the gate (teaser + upgrade CTA for non-premium
  // viewers); free guides render in full for everyone.
  const body = guide.premium ? (
    <PremiumGuideGate slug={guide.slug} content={guide.content} />
  ) : (
    <GuideBody content={guide.content} />
  );

  return (
    <ConceptsLayout>
      <GuideBreadcrumb guideTitle={guide.title} locale={locale} />
      <GuideLayout rightPanel={<RelatedGuides guides={relatedGuides} locale={locale} />}>
        <GuideHero title={guide.title} intro={guide.excerpt} />
        <article>{body}</article>
      </GuideLayout>
    </ConceptsLayout>
  );
}
