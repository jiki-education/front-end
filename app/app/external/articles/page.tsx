import ArticlesPage from "@/components/articles/ArticlesPage";

export const dynamic = "force-static";

export default function ExternalArticlesPage() {
  return <ArticlesPage authenticated={false} locale="en" />;
}
