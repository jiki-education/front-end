"use client";

import { useAuth } from "@/lib/auth/hooks";
import { fetchConcept } from "@/lib/api/concepts";
import type { ConceptDetail } from "@/types/concepts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MarkdownContent from "@/components/content/MarkdownContent";
import { mockConcepts } from "@/lib/data/mockConcepts";
import { mockSubconcepts } from "@/lib/data/mockSubconcepts";
import { ConceptsLayout, ConceptCard } from "@/components/concepts-page";
import { Breadcrumb, ConceptCardsLoadingSkeleton } from "@/components/concepts-page";
import "../concepts.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ConceptDetailPage({ params }: Props) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const [concept, setConcept] = useState<ConceptDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const withSidebar = isReady && isAuthenticated;

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    void resolveParams();
  }, [params]);

  useEffect(() => {
    const loadConcept = async () => {
      if (!isReady || !slug) {
        return;
      }

      // For authenticated users with mock subconcepts, skip API call
      if (isAuthenticated && slug in mockSubconcepts) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use unscoped=true for logged out users to show all concepts
        const unscoped = !isAuthenticated;
        const data = await fetchConcept(slug, unscoped);
        setConcept(data);
      } catch (err: any) {
        if (err.status === 404) {
          setError("Concept not found.");
        } else if (err.status === 403) {
          setError("This concept is locked. Sign up to unlock it!");
        } else {
          setError("Failed to load concept. Please try again later.");
        }
        console.error("Error fetching concept:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadConcept();
  }, [isAuthenticated, isReady, slug]);

  // Get current concept and subconcepts
  const currentConcept = mockConcepts.find((c) => c.slug === slug);
  const subconcepts = slug in mockSubconcepts ? mockSubconcepts[slug] : undefined;

  // Show loading for subconcepts page
  if (isAuthenticated && subconcepts && currentConcept && (!isReady || isLoading)) {
    return (
      <ConceptsLayout withSidebar={withSidebar}>
        <Breadcrumb conceptSlug={slug} conceptTitle={currentConcept.title} />

        <header>
          <h1 className="page-heading">
            <svg className="heading-icon w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18M8 12h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {currentConcept.title}
          </h1>
        </header>

        <ConceptCardsLoadingSkeleton />
      </ConceptsLayout>
    );
  }

  // Show loading for regular concept detail page
  if (!isReady || isLoading) {
    return (
      <ConceptsLayout withSidebar={withSidebar}>
        <div className="animate-pulse">
          <div className="mb-12">
            <div className="mb-6 h-12 w-3/4 bg-gray-200 rounded"></div>
            <div className="mb-4 h-4 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ConceptsLayout>
    );
  }

  if (error) {
    return (
      <ConceptsLayout withSidebar={withSidebar}>
        <div className="text-center">
          <div className="mb-4 text-red-600 text-lg">{error}</div>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/concepts")}
              className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back to Concepts
            </button>
            {error.includes("locked") && (
              <button
                onClick={() => router.push("/auth/signup")}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </ConceptsLayout>
    );
  }

  // Show subconcepts view for authenticated users when subconcepts exist
  if (isAuthenticated && subconcepts && currentConcept) {
    return (
      <ConceptsLayout withSidebar={withSidebar}>
        <Breadcrumb conceptSlug={slug} conceptTitle={currentConcept.title} />

        <header>
          <h1 className="page-heading">
            <svg className="heading-icon w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18M8 12h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {currentConcept.title}
          </h1>
        </header>

        <div className="concepts-grid">
          {subconcepts.map((subconcept) => (
            <ConceptCard key={subconcept.slug} concept={subconcept} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      </ConceptsLayout>
    );
  }

  // Fallback to original detail view for concepts without subconcepts or non-authenticated users
  if (!concept) {
    return (
      <ConceptsLayout withSidebar={withSidebar}>
        <div className="text-center">
          <p className="text-gray-600 text-lg">Concept not found.</p>
          <button
            onClick={() => router.push("/concepts")}
            className="mt-4 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back to Concepts
          </button>
        </div>
      </ConceptsLayout>
    );
  }

  return (
    <ConceptsLayout withSidebar={withSidebar}>
      <nav className="mb-4">
        <button
          onClick={() => router.push("/concepts")}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Concepts
        </button>
      </nav>

      <h1 className="mb-6 text-5xl font-bold text-gray-900">{concept.title}</h1>
      <p className="mb-6 text-xl text-gray-600 leading-relaxed">{concept.description}</p>

      {(concept.standard_video_provider || concept.premium_video_provider) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Video content available for this concept</span>
          </div>
          {concept.premium_video_provider && (
            <p className="mt-2 text-sm text-blue-700">Premium video content available for subscribers</p>
          )}
        </div>
      )}

      <MarkdownContent content={concept.content_html} />
    </ConceptsLayout>
  );
}
