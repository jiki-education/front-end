import React from "react";

interface ConceptHeroProps {
  category?: string;
  title: string;
  intro?: string;
}

export default function ConceptHero({ category, title, intro }: ConceptHeroProps) {
  return (
    <div
      className="py-60 px-40 mb-32 rounded-24"
      style={{
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
      }}
    >
      {category && (
        <div
          className="inline-block px-12 py-6 mb-16 rounded-8 text-12 font-semibold uppercase tracking-wider"
          style={{
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)",
            color: "#667eea"
          }}
        >
          {category}
        </div>
      )}

      <h1 className="text-56 font-bold mb-16" style={{ lineHeight: "1.2", color: "#1a202c" }}>
        {title}
      </h1>

      {intro && (
        <p className="text-20 mb-0" style={{ lineHeight: "1.6", color: "#4a5568" }}>
          {intro}
        </p>
      )}
    </div>
  );
}
