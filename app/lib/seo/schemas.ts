import { SITE_URL } from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Jiki",
    url: SITE_URL,
    logo: `${SITE_URL}/static/images/logo-peeking.webp`,
    description: "Learn to code and build in the LLM-era. Fun, effective and free.",
    sameAs: ["https://www.youtube.com/@jiki-coding"]
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: "Jiki",
    inLanguage: "en",
    publisher: { "@id": ORG_ID }
  };
}

export function conceptLearningResourceSchema(concept: { slug: string; title: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: concept.title,
    description: concept.description,
    url: `${SITE_URL}/concepts/${concept.slug}`,
    inLanguage: "en",
    learningResourceType: "Concept",
    educationalLevel: "Beginner",
    teaches: concept.title,
    isAccessibleForFree: true,
    provider: { "@id": ORG_ID }
  };
}
