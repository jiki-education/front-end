import ArticlesPage from "@/components/articles/ArticlesPage";
import AuthenticatedHeaderLayout from "@/components/layout/AuthenticatedHeaderLayout";

export default function AppArticlesPage() {
  return (
    <AuthenticatedHeaderLayout>
      <ArticlesPage authenticated locale="en" />
    </AuthenticatedHeaderLayout>
  );
}
