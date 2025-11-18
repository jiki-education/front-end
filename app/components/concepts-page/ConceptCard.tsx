import Link from "next/link";
import type { ConceptListItem } from "@/types/concepts";

interface ConceptCardProps {
  concept: ConceptListItem;
  isAuthenticated: boolean;
}

export default function ConceptCard({ concept, isAuthenticated }: ConceptCardProps) {
  const cardStyles = isAuthenticated
    ? "group rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm transition-all hover:shadow-lg"
    : "group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg";

  const titleStyles = isAuthenticated
    ? "mb-3 text-xl font-bold text-text-primary transition-colors group-hover:text-link-primary"
    : "mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600";

  const descriptionStyles = isAuthenticated
    ? "mb-4 line-clamp-3 text-text-secondary"
    : "mb-4 line-clamp-3 text-gray-700";

  const videoTextStyles = isAuthenticated ? "text-info-text" : "text-blue-600";

  return (
    <article className={cardStyles}>
      <Link href={`/concepts/${concept.slug}`}>
        <h2 className={titleStyles}>{concept.title}</h2>
      </Link>
      <p className={descriptionStyles}>{concept.description}</p>

      {(concept.standard_video_provider || concept.premium_video_provider) && (
        <div className={`flex items-center gap-2 text-sm ${videoTextStyles}`}>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          <span>Video available</span>
        </div>
      )}
    </article>
  );
}
