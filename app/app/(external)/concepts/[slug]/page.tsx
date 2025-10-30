"use client";

import { useAuth } from "@/lib/auth/hooks";
import { fetchConcept } from "@/lib/api/concepts";
import type { ConceptDetail } from "@/types/concepts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MarkdownContent from "@/components/content/MarkdownContent";

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

  if (!isReady || isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse">
          <div className="mb-12">
            <div className="mb-6 h-12 w-3/4 bg-gray-200 rounded"></div>
            <div className="mb-4 h-4 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
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
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Concept not found.</p>
          <button
            onClick={() => router.push("/concepts")}
            className="mt-4 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back to Concepts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <article>
        <header className="mb-12">
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
        </header>

        <MarkdownContent content={concept.content_html} />
      </article>
    </div>
  );
}
