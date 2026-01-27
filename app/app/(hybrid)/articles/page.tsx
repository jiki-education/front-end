import ArticlesPage from "@/components/articles/ArticlesPage";
import HeaderLayout from "@/components/layout/HeaderLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles - Jiki",
  description: "Explore in-depth programming tutorials, guides, and technical articles to level up your coding skills."
};

interface Props {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function AppArticlesPage({ searchParams }: Props) {
  const { tag, page } = await searchParams;

  return (
    <HeaderLayout>
      <ArticlesPage authenticated locale="en" tag={tag} page={page} />
    </HeaderLayout>
  );
}
