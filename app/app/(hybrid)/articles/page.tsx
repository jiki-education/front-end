import ArticlesPage from "@/components/articles/ArticlesPage";
import HeaderLayout from "@/components/layout/HeaderLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles - Jiki",
  description: "Explore in-depth programming tutorials, guides, and technical articles to level up your coding skills."
};

export default function AppArticlesPage() {
  return (
    <HeaderLayout>
      <ArticlesPage authenticated locale="en" />
    </HeaderLayout>
  );
}
