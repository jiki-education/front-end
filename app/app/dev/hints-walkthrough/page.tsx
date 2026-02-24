"use client";

import HintsPanel from "@/components/coding-exercise/ui/HintsPanel";
import { GlobalModalProvider } from "@/lib/modal/GlobalModalProvider";

const sampleHints = [
  "Try using a <code>for</code> loop to iterate through the array.",
  "Remember that arrays are zero-indexed in most programming languages.",
  "Consider using the <code>modulo</code> operator to check for even/odd numbers."
];

const walkthroughVideoData = [{ provider: "mux", id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU" }];

export default function HintsWalkthroughPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <GlobalModalProvider />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">HintsPanel — Walkthrough Video Section</h1>

        <div className="space-y-10">
          <Section label="Hints + Walkthrough Video">
            <HintsPanel hints={sampleHints} walkthroughVideoData={walkthroughVideoData} lessonSlug="test-lesson" />
          </Section>

          <Section label="Walkthrough Video Only (no hints)">
            <HintsPanel hints={[]} walkthroughVideoData={walkthroughVideoData} lessonSlug="test-lesson" />
          </Section>

          <Section label="Hints Only (no walkthrough)">
            <HintsPanel hints={sampleHints} />
          </Section>

          <Section label="Empty State (no hints, no walkthrough)">
            <HintsPanel hints={[]} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{label}</h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ maxWidth: 480 }}>
        {children}
      </div>
    </div>
  );
}
