import type { Metadata } from "next";
import { RoadmapPage } from "@/components/roadmap/RoadmapPage";

export const metadata: Metadata = {
  title: "Roadmap - Jiki",
  description:
    "What we're building next on Jiki. A quarter-by-quarter look at upcoming courses, projects, and features."
};

export default function Page() {
  return <RoadmapPage />;
}
