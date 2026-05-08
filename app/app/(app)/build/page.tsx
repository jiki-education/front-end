import SidebarLayout from "../../../components/layout/SidebarLayout";
import { BuildIndex } from "./BuildIndex";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn to Build - Jiki",
  description: "Watch video series on building real projects, deep-dives into how things work, and live Q&A sessions."
};

export default function BuildPage() {
  return (
    <SidebarLayout activeItem="build">
      <BuildIndex />
    </SidebarLayout>
  );
}
